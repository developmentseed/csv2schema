/**
 * Convert a comma separated value (csv) file to JSON Spec format.
 * 
 * Assumes first column contains keys.
 *
 */

var csv = require('csv');


var handlers = {
    seriesYear: require('./handlers/seriesYear'),
};

/**
 * @param {string} a string input file, in CSV format.
 * @param {string} a string filename, existing or new.
 */
var convert = function(output, input) {
    return csv()
        .fromPath(input, {columns: true})
        .transform(function(data) {
            var obj = {};
            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    typeof data[k] == 'string' ? obj[k.trim()] = data[k].trim() : obj[k.trim()] = data[k];
                }
            }
            return obj;
        })
        .on('data', function(data, index) {
            var self = this;
            self.emit("message", "Processed a row of data.");

            var key = data.field;
            var type = {}

            data.name && (type.name = data.name)
            data.definition && (type.definition = data.definition)
            type.type = data.type || "object"
            data.extends && (type.extends = {"$ref": data.extends})
            data.format && (type.format = data.format)
            data.group && (type.group = data.group)


            output.properties[key] = type;
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
