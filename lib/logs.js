/**
 * Library for storing and rotating logs
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Container for the module
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.logs/");

// Append a string to a file. Create the file if it does not exist.
lib.append = function(file, str, callback) {
  // Opent the file for appending
  fs.open(lib.baseDir + file + ".log", "a", function(err, fileDescriptor) {
    if (!err && fileDescriptor) {
      // Appending to file and close it
      fs.appendFile(fileDescriptor, str + "\n", function(err) {
        if (!err) {
          fs.close(fileDescriptor, function(err) {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing to file that was being appended");
            }
          });
        } else {
          callback("Error appending to file");
        }
      });
    } else {
      console.log("Could not open file for appending");
    }
  });
};

// List all the logs, and optionally include the compressed logs
lib.list = function(includeCompressedLogs, callback) {
  fs.readdir(lib.baseDir, function(err, data) {
    if (!err && data && data.length > 0) {
      const trimmedFileNames = [];
      data.forEach(function(fileName) {
        // Add the logs files
        if (fileName.indexOf(".log") > -1) {
          trimmedFileNames.push(fileName.replace(".log", ""));
        }

        // Add on the .gz files
        if (fileName.indexOf(".gz.b64") > -1 && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace(".gz.b64", ""));
        }
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};

// compress the content of one .log file into a .gz.b64 file within the same directory
lib.compress = function(logId, newFileId, callback) {
  const sourceFile = logId + ".log";
  const destFile = logId + ".gz.b64";

  // Read the source file
  fs.readFile(lib.baseDir + sourceFile, "utf8", function(err, inputString) {
    if (!err && inputString) {
      // Compress the data using gzip
      zlib.gzip(inputString, function(err, buffer) {
        if (!err && buffer) {
          // Send the data to the destination file
          fs.open(lib.baseDir + destFile, "wx", function(err, fileDescriptor) {
            if (!err && fileDescriptor) {
              // write to the destination file
              fs.writeFile(fileDescriptor, buffer.toString("base64"), function(
                err
              ) {
                if (!err) {
                  fs.close(fileDescriptor, function(er) {
                    if (!err) {
                      callback(false);
                    } else {
                      callback(err);
                    }
                  });
                } else {
                  callback(err);
                }
              });
            } else {
              callback(err);
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
    }
  });
};

// Decompress the content of a .gz.base64 into a string variable
lib.decompress = function(fileId, callback) {
  const fileName = fileId + ".gz.base64";
  fs.readFile(lib.baseDir + fileName, "utf8", function(err, str) {
    if (!err && str) {
      // Decompress the data
      const inputBuffer = Buffer.from(str, "base64");
      zlib.unzip(inputBuffer, function(err, outputBuffer) {
        if (!err && outputBuffer) {
          const str = outputBuffer.toString();
          callback(false, str);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

lib.truncate = function(logId, callback) {
  fs.truncate(lib.baseDir + logId + ".log", 0, function(err) {
    if (!err) {
      callback(false);
    } else {
      callback(err);
    }
  });
};
module.exports = lib;
