#!/usr/bin/env node


require.paths.unshift(__dirname + '/modules', __dirname + '/lib/node', __dirname);
var fs = require('fs'),
    run = require('./csv2schema').run;

if (process.argv.length < 4) {
  console.log("Usage: ./csv2schema <inputfile> <outputfile>");
  process.exit(1);
}

var inputfile = process.argv[2];
var outputfile = process.argv[3];

/**
 * Command line interface
 */
fs.stat(inputfile, function(err, stats) {
    // Input file found.
    if (err === null) {
        fs.stat(outputfile, function(err2, stats2) {
            if (err2 === null) {
                // Output file exists; ask whether ok to overwrite..
                console.log('File ' + outputfile + ' exists.  (y) to overwrite, (n) to exit.');
                var stdin = process.openStdin();
                stdin.setEncoding('utf8');

                stdin.on('data', function (chunk) {
                    if (chunk === 'y\n') {
                        run(inputfile, function(json) {
                            write(outputfile, json, function(err, written) {
                                // Add some message.
                                stdin.emit('success');
                            });
                        });
                    }
                    else if (chunk === 'n\n') {
                        stdin.emit('error'); 
                    }
                });
                stdin.on('success', function () {
                    console.log('Job completed.');
                    process.exit();
                });
                stdin.on('error', function () {
                    console.log('Could not complete job.  Try again.');
                    process.exit();
                });
            }
            // Output file does not exist, ok to proceed w/o prompt.
            else {
               run(inputfile, function(json) {
                   write(outputfile, json, function(eopen, ewrite, written) {
                       // Add some message.
                       console.log('File written');
                   });
               });
            }
        });
    }
    else {
        console.log('Input file not found.');
    }
});


/**
 * Write a file to disk
 *
 * @param {string} a string filename, existing or new.
 * @param {string} a string which will be written to the file.
 */
function write(outputfile, buffer, cb) {
    var fd = fs.openSync(outputfile, 'w');
    fs.writeSync(fd, buffer);
    cb();
    // @TODO error handling
}
