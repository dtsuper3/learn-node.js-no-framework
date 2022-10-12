/**
 * Requet handlers
 */

//  Dependencies
const _data = require("./data");
const helpers = require("./helpers");
const config = require("./config");

// Define the handlers
const handlers = {};

/**
 * HTML handlers
 */

// Index handler
handlers.index = function (data, callback) {
  // Reject any request that isn't GET
  if (data.method == "get") {
    // Prepare data for string interpolation
    const templateData = {
      "head.title": "Uptime Monitoring made simple",
      "head.description":
        "We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kind. When your site goes down, we'll send you text to let you know.",
      "body.class": "index"
    };
    // Read in a template as astring
    helpers.getTemplate("index", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Create Account
handlers.accountCreate = function (data, callback) {
  // Reject any request that isn't GET
  if (data.method == "get") {
    // Prepare data for string interpolation
    const templateData = {
      "head.title": "Create an account",
      "head.description": "Signup is easy and only takes a few seconds.",
      "body.class": "accountCreate"
    };
    // Read in a template as astring
    helpers.getTemplate("accountCreate", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Create New Session
handlers.sessionCreate = function (data, callback) {
  // Reject any request that isn't GET
  if (data.method == "get") {
    // Prepare data for string interpolation
    const templateData = {
      "head.title": "Login to your account",
      "head.description":
        "Please enter your phone number and password to access your account.",
      "body.class": "sessionCreate"
    };
    // Read in a template as astring
    helpers.getTemplate("sessionCreate", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Session has been deleted
handlers.sessionDeleted = function (data, callback) {
  // Reject any request that isn't GET
  if (data.method == "get") {
    // Prepare data for string interpolation
    const templateData = {
      "head.title": "Login Out",
      "head.description": "You have been log out of your account.",
      "body.class": "sessionDeleted"
    };
    // Read in a template as astring
    helpers.getTemplate("sessionDeleted", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Edit your account
handlers.accountEdit = function (data, callback) {
  // Reject any request that isn't GET
  if (data.method == "get") {
    // Prepare data for string interpolation
    const templateData = {
      "head.title": "Account Settings",
      "body.class": "accountEdit"
    };
    // Read in a template as astring
    helpers.getTemplate("accountEdit", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Delete your account
handlers.accountDeleted = function (data, callback) {
  // Reject any request that isn't GET
  if (data.method == "get") {
    // Prepare data for string interpolation
    const templateData = {
      "head.title": "Account Settings",
      "head.description": "Your account has been deleted",
      "body.class": "accountDeleted"
    };
    // Read in a template as astring
    helpers.getTemplate("accountDeleted", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};
// favicon
handlers.favicon = function (data, callback) {
  // Reject any request that isn't GET
  if (data.method == "get") {
    // Read in the favicon's data
    helpers.getStaticAsset("favicon.ico", function (err, data) {
      if (!err && data) {
        callback(200, data, "favicon");
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

// Public Asset
handlers.public = function (data, callback) {
  // Reject any request that isn't GET
  if (data.method == "get") {
    // Get the filename being requested
    const trimmedAssetName = data.trimmedPath.replace("public/", "").trim();
    if (trimmedAssetName.length > 0) {
      helpers.getStaticAsset(trimmedAssetName, function (err, data) {
        if (!err && data) {
          // Determine the content type (default plain text)
          let contentType = "plain";

          if (trimmedAssetName.indexOf(".css") > -1) {
            contentType = "css";
          }

          if (trimmedAssetName.indexOf(".js") > -1) {
            contentType = "text/javascript";
          }

          if (trimmedAssetName.indexOf(".png") > -1) {
            contentType = "png";
          }

          if (trimmedAssetName.indexOf(".jpg") > -1) {
            contentType = "jpg";
          }

          if (trimmedAssetName.indexOf(".favicon") > -1) {
            contentType = "favicon";
          }
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};
/**
 * JSON API handlers
 */
// users
handlers.user = function (data, callback) {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(403);
  }
};

// Container for the users submethods
handlers._users = {};

// users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// @TODO create token and return when user created
handlers._users.post = function (data, callback) {
  // Check that all required fields are filled out
  const firstName =
    typeof data.payload.firstName == "string" &&
      data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == "string" &&
      data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const phone =
    typeof data.payload.phone == "string" &&
      data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
      data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  const tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
      data.payload.tosAgreement === true
      ? true
      : false;
  if (firstName && lastName && phone && password && tosAgreement) {
    // Make sure that the user doesnt already exist
    _data.read("users", phone, function (err, data) {
      if (err) {
        // hash the password
        const hashPassword = helpers.hash(password);

        // Create the user object
        if (hashPassword) {
          const userObject = {
            firstName,
            lastName,
            phone,
            hashPassword,
            tosAgreement
          };

          // store the user
          _data.create("users", phone, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: "Could not create new user" });
            }
          });
        } else {
          callback(500, { Error: "Could not hash the user's password" });
        }
      } else {
        // user already exists
        callback(400, {
          Error: "A user with that phone number already exists"
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// users - get
// Required data: phone
// Optional: none
handlers._users.get = function (data, callback) {
  // Check that the phone number is valid
  const phone =
    typeof data.queryStringObject.phone == "string" &&
      data.queryStringObject.phone.trim().length == 10
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    // Get the token from the headers
    const token =
      typeof data.headers.token === "string" ? data.headers.token : false;

    // verify the given token is valid for phone number
    handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the user
        _data.read("users", phone, function (err, data) {
          if (!err && data) {
            // remove the hashed password from the user object before returning to the request
            delete data.hashPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid"
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
// users - put
// Required data - phone
// optional data - firstName, lastName, password (at least one must be specified)
handlers._users.put = function (data, callback) {
  // Check that the phone number is valid
  const phone =
    typeof data.payload.phone == "string" &&
      data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;

  const firstName =
    typeof data.payload.firstName == "string" &&
      data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == "string" &&
      data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
      data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      // Get the token from the headers
      const token =
        typeof data.headers.token === "string" ? data.headers.token : false;

      // verify the given token is valid for phone number
      handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
        if (tokenIsValid) {
          // Lookup the user
          _data.read("users", phone, function (err, userData) {
            if (!err && userData) {
              // Update the fields neccassary
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.hashPassword = helpers.hash(password);
              }
              _data.update("users", phone, userData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  console.log(err);
                  callback(500, { Error: "Could not update the user" });
                }
              });
            } else {
              callback(400, { Error: "The specified user does not exist" });
            }
          });
        } else {
          callback(403, {
            Error: "Missing required token in header, or token is invalid"
          });
        }
      });
    } else {
      callback(400, { Error: "Missing required field" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// users - delete
// Required field : phone
// TOdO remove token when user deleted
handlers._users.delete = function (data, callback) {
  // Check that the phone number is valid
  const phone =
    typeof data.queryStringObject.phone == "string" &&
      data.queryStringObject.phone.trim().length == 10
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    const token =
      typeof data.headers.token === "string" ? data.headers.token : false;

    // verify the given token is valid for phone number
    handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the user
        _data.read("users", phone, function (err, data) {
          if (!err && data) {
            // remove the hashed password from the user object before returning to the request
            _data.delete("users", phone, function (err) {
              if (!err) {
                // Delete each of the checks associated with the user
                const userChecks =
                  typeof data.checks == "object" && data.checks instanceof Array
                    ? data.checks
                    : [];
                const checkToDelete = userChecks.length;
                if (checkToDelete > 0) {
                  let checksDeleted = 0;
                  let deletionErrors = false;
                  // Loop through the checks
                  userChecks.forEach(function (checkId) {
                    _data.delete("checks", checkId, function (err) {
                      if (err) {
                        deletionErrors = true;
                      }
                      checksDeleted++;
                      if (checksDeleted === checkToDelete) {
                        if (!deletionErrors) {
                          callback(200);
                        } else {
                          callback(500, {
                            Error:
                              "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted successfully"
                          });
                        }
                      }
                    });
                  });
                } else {
                  callback(200);
                }
              } else {
                callback(500, { Error: "Could not delete the user" });
              }
            });
          } else {
            callback(400, { Error: "Could not found the user" });
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid"
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Tokens
handlers.tokens = function (data, callback) {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(403);
  }
};

// Container for all the tokens methods
handlers._tokens = {};

// Tokens - post
// Required data : phone,password
// Optional data : none
handlers._tokens.post = function (data, callback) {
  const phone =
    typeof data.payload.phone == "string" &&
      data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
      data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  if (phone && password) {
    // Lookup the user who matches that phone number
    _data.read("users", phone, function (err, userData) {
      if (!err && userData) {
        // Hash the sent password and compare to the password store in users password
        const hashPassword = helpers.hash(password);
        if (hashPassword == userData.hashPassword) {
          // if valid create a new token with a random set expiration date 1 hour in the future
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            phone,
            id: tokenId,
            expires
          };

          // Store the token
          _data.create("tokens", tokenId, tokenObject, function (err) {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: "Could not create the new token" });
            }
          });
        } else {
          callback(400, {
            Error: "Password did not match the user's password"
          });
        }
      } else {
        callback(400, { Error: "Could not found the user" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field(s)" });
  }
};

// Tokens - get
// Required data : id
// Optional data : none
handlers._tokens.get = function (data, callback) {
  // Check that id is valid
  const id =
    typeof data.queryStringObject.id == "string" &&
      data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the user
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        // remove the hashed password from the user object before returning to the request
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// tokens - put
// Required data : id, extend
// Optional data : none
handlers._tokens.put = function (data, callback) {
  const id =
    typeof data.payload.id == "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;
  const extend =
    typeof data.payload.extend == "boolean" && data.payload.extend === true
      ? true
      : false;
  if (id && extend) {
    // Lookup the token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        // Check to make sure the token isn't already expired
        if (tokenData.expires > Date.now()) {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          // Store the new update
          _data.update("tokens", id, tokenData, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                Error: "Could not update the token's expiration"
              });
            }
          });
        } else {
          callback(400, {
            Error: "The token has already expired, and cannot be extended"
          });
        }
      } else {
        callback(400, { Error: "Specified token does not exist" });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field(s) or fields(s) are invalid"
    });
  }
};

// Tokens - delete
// Required Data : id
// Optional Data : none
handlers._tokens.delete = function (data, callback) {
  // Check that the id is valid
  const id =
    typeof data.queryStringObject.id == "string" &&
      data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the token
    _data.read("tokens", id, function (err, data) {
      if (!err && data) {
        // remove the hashed password from the user object before returning to the request
        _data.delete("tokens", id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Could not delete the token" });
          }
        });
      } else {
        callback(400, { Error: "Could not found the token" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function (id, phone, callback) {
  // Lookup the token
  _data.read("tokens", id, function (err, tokenData) {
    if (!err && tokenData) {
      // Check that the token is for the given user and that has not expired
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// Checks
handlers.checks = function (data, callback) {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(403);
  }
};

// Container for all the checks methods
handlers._checks = {};

// Checks - post
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
handlers._checks.post = function (data, callback) {
  // Validates inputs
  const protocol =
    typeof data.payload.protocol == "string" &&
      ["https", "http"].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  const url =
    typeof data.payload.url == "string" && data.payload.url.trim().length > 0
      ? data.payload.url.trim()
      : false;
  const method =
    typeof data.payload.method == "string" &&
      ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;
  const successCodes =
    typeof data.payload.successCodes == "object" &&
      data.payload.successCodes instanceof Array &&
      data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;
  const timeoutSeconds =
    typeof data.payload.timeoutSeconds == "number" &&
      data.payload.timeoutSeconds % 1 === 0 &&
      data.payload.timeoutSeconds >= 1 &&
      data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // Get the token from the headers
    const token =
      typeof data.headers.token == "string" ? data.headers.token : false;

    // lookup the user by reading the token
    _data.read("tokens", token, function (err, tokenData) {
      if (!err && tokenData) {
        const userPhone = tokenData.phone;

        // lookup the user data
        _data.read("users", userPhone, function (err, userData) {
          if (!err && userData) {
            const userChecks =
              typeof userData.checks == "object" &&
                userData.checks instanceof Array
                ? userData.checks
                : [];
            // Verify that the user has less than the number of max-checks-per-user
            if (userChecks.length < config.maxChecks) {
              // create a random id for the checks
              const checkId = helpers.createRandomString(20);

              // Check the check object, and include the user's phone
              const checkObject = {
                id: checkId,
                userPhone,
                protocol,
                url,
                method,
                successCodes,
                timeoutSeconds
              };

              // Store the object
              _data.create("checks", checkId, checkObject, function (err) {
                if (!err) {
                  // Add the check id to the user's object
                  userData.checks = userChecks;
                  userData.checks.push(checkId);

                  // save the new user data
                  _data.update("users", userPhone, userData, function (err) {
                    if (!err) {
                      // Return the data about the new check
                      callback(200, checkObject);
                    } else {
                      callback(500, {
                        Error: "Could not update the user with new check"
                      });
                    }
                  });
                } else {
                  callback(500, { Error: "Could not create the new check" });
                }
              });
            } else {
              callback(400, {
                Error: `The user already has the maximum number of checks (${
                  config.maxChecks
                  })`
              });
            }
          } else {
            callback(403);
          }
        });
      } else {
        callback(403);
      }
    });
  } else {
    callback(400, { Error: "Missing required inputs, or inputs are invalid" });
  }
};

// Checks - get
// Required data: id
// Optional data: none
handlers._checks.get = function (data, callback) {
  // Check that the id is valid
  const id =
    typeof data.queryStringObject.id == "string" &&
      data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the check
    _data.read("checks", id, function (err, checkData) {
      if (!err && checkData) {
        // Get the token from the headers
        const token =
          typeof data.headers.token === "string" ? data.headers.token : false;

        // verify the given token is valid and belongs to the user who created the check
        handlers._tokens.verifyToken(token, checkData.userPhone, function (
          tokenIsValid
        ) {
          if (tokenIsValid) {
            // Return the check data
            callback(200, checkData);
          } else {
            callback(403);
          }
        });
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Checks - put
// Required data: id
// Optional data: protocol, url, method, successCodes, timeoutSeconds (one must be sent)
handlers._checks.put = function (data, callback) {
  // Check that the id is valid
  const id =
    typeof data.payload.id == "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;
  // Validates inputs
  const protocol =
    typeof data.payload.protocol == "string" &&
      ["https", "http"].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  const url =
    typeof data.payload.url == "string" && data.payload.url.trim().length > 0
      ? data.payload.url.trim()
      : false;
  const method =
    typeof data.payload.method == "string" &&
      ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;
  const successCodes =
    typeof data.payload.successCodes == "object" &&
      data.payload.successCodes instanceof Array &&
      data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;
  const timeoutSeconds =
    typeof data.payload.timeoutSeconds == "number" &&
      data.payload.timeoutSeconds % 1 === 0 &&
      data.payload.timeoutSeconds >= 1 &&
      data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  // Check to make sure id is valid
  if (id) {
    // Check to make sure one or many optional fields has been sent
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // lookup the checks
      _data.read("checks", id, function (err, checkData) {
        if (!err && checkData) {
          // Get the token from the headers
          const token =
            typeof data.headers.token === "string" ? data.headers.token : false;

          // verify the given token is valid and belongs to the user who created the check
          handlers._tokens.verifyToken(token, checkData.userPhone, function (
            tokenIsValid
          ) {
            if (tokenIsValid) {
              // update the check where neccessary
              if (protocol) {
                checkData.protocol = protocol;
              }
              if (url) {
                checkData.url = url;
              }
              if (method) {
                checkData.method = method;
              }
              if (successCodes) {
                checkData.successCodes = successCodes;
              }
              if (timeoutSeconds) {
                checkData.timeoutSeconds = timeoutSeconds;
              }

              // Store the update
              _data.update("checks", id, checkData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, { Error: "Could not update the check" });
                }
              });
            } else {
              callback(403);
            }
          });
        } else {
          callback(400, { Error: "Check ID did not exist" });
        }
      });
    } else {
      callback(400, { Error: "Missing fields to update" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Checks - put
// Required data: id
// Optional data: none
handlers._checks.delete = function (data, callback) {
  // Check that the id number is valid
  const id =
    typeof data.queryStringObject.id == "string" &&
      data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the check
    _data.read("checks", id, function (err, checkData) {
      if (!err && checkData) {
        const token =
          typeof data.headers.token === "string" ? data.headers.token : false;

        // verify the given token is valid for phone number
        handlers._tokens.verifyToken(token, checkData.userPhone, function (
          tokenIsValid
        ) {
          if (tokenIsValid) {
            // Delete the check data
            _data.delete("checks", id, function (err) {
              if (!err) {
                // Lookup the user
                _data.read("users", checkData.userPhone, function (
                  err,
                  userData
                ) {
                  if (!err && userData) {
                    const userChecks =
                      typeof userData.checks == "object" &&
                        userData.checks instanceof Array
                        ? userData.checks
                        : [];

                    // Remove the delete check from their list of checks
                    const checkPosition = userChecks.indexOf(id);
                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1);
                      // Replace the user's data
                      _data.update(
                        "users",
                        checkData.userPhone,
                        userData,
                        function (err) {
                          if (!err) {
                            callback(200);
                          } else {
                            callback(500, {
                              Error: "Could not update the user"
                            });
                          }
                        }
                      );
                    } else {
                      callback(500, {
                        Error:
                          "Could not find the check on the user's object, so could not delete the check"
                      });
                    }

                    // remove the hashed password from the user object before returning to the request
                  } else {
                    callback(400, {
                      Error:
                        "Could not find the user who created the check, so could not remove the check from the list of checks on the user object"
                    });
                  }
                });
              } else {
                callback(500, { Error: "Could not delete the check data" });
              }
            });
          } else {
            callback(403);
          }
        });
      } else {
        callback(400, { Error: "The specified check ID does not exists" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
// ping handler
handlers.ping = function (data, callback) {
  // callback a http status code, and a payload object
  callback(200);
};

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

module.exports = handlers;
