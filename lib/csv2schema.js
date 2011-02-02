/**
 * Convert a comma separated value (csv) file to JSON Spec format.
 * 
 * Assumes first column contains keys.
 *
 */

var csv = require('csv');


var handlers = {
    yearSeries: require('./handlers/seriesYear'),
};

/**
 * @param {string} a string input file, in CSV format.
 * @param {string} a string filename, existing or new.
 */
var convert = function(output, input) {
    return csv()
        .fromPath(input, {columns: true})
        .on('data', function(data, index) {
            var self = this;
            self.emit("message", "Processed a row of data.");
            // First item is the key, under which the other items nest.
            for (i in data) {
                // Set parent key to first column header.
                // Of course, assumes first column is really the key.
                if (typeof key === 'undefined') {
                    var key = data[i];
                    output.properties[key] = {};
                } 
                else {
                    // Handle special fields (hack it in for now).
                    if (i === 'type') {
                        // Handlers define type and value.  Values in 'type' column must refer to a handler
                        // or otherwise they're ignored.
                        if (typeof handlers[data[i]] != undefined && handlers[data[i]] instanceof Object) {
                            output.properties[key][handlers[data[i]].type] = handlers[data[i]].value;
                        }
                        // Default to setting key:val
                        output.properties[key][i] = data[i];
                    }
                    else {
                        // output.properties.first.type = "string"
                        output.properties[key][i] = data[i];
                    }
                }
            }
        });
}

/**
 * @param {string} a string input file, in CSV format.
 */
function run(input, cb) {
    // Initialize output buffer, eventually written to file.
    var output = {};
    output.type = 'object';
    output.properties = {};
    convert(output, input)
    .on('message', function(message) {
        //console.log(message);
    })
    .on('end', function(count) {
      // Pass back object.
      cb(output);
    })
};

exports.run = run;
exports.handlers = handlers;
