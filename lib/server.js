/**
 * Server~related tasks
 */
// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const path = require("path");
const stringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const helpers = require("./helpers");
const handlers = require("./handlers");
const util = require("util");
const debug = util.debuglog("server");

// Instantiate the server module object
const server = {};

// All the server logic for both the http and https server
server.unifiedServer = function(req, res) {
  // Get the url and parse it
  const parseUrl = url.parse(req.url, true);

  // get the path
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  const queryStringObject = parseUrl.query;

  // get the http method
  const method = req.method.toLocaleLowerCase();

  // get the headers as an object
  const headers = req.headers;

  // get the payload, if any
  const decoder = new stringDecoder("utf-8");
  let buffer = "";
  req.on("data", function(data) {
    buffer += decoder.write(data);
  });
  req.on("end", function() {
    buffer += decoder.end();

    // Choose the handler the request should go to.
    let choosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handlers.notFound;

    // if the request is within public directory, use public handler instead
    choosenHandler =
      trimmedPath.indexOf("public/") > -1 ? handlers.public : choosenHandler;
    // console.log(trimmedPath, choosenHandler);
    // construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer)
    };

    // Route the request to the handler specified in the router
    choosenHandler(data, function(statusCode, payload, contentType) {
      // Determine the type of response (fallback to JSON)
      contentType = typeof contentType === "string" ? contentType : "json";
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode === "number" ? statusCode : 200;

      // return the response parts that are content-specific
      let payloadString = "";
      if (contentType === "json") {
        res.setHeader("Content-Type", "application/json");
        // Use the payload called back by the handler, or default to an empty object
        payload = typeof payload == "object" ? payload : {};
        // convert the payload to a string
        payloadString = JSON.stringify(payload);
      }
      if (contentType === "html") {
        res.setHeader("Content-Type", "text/html");
        payloadString = typeof payload === "string" ? payload : "";
      }

      if (contentType === "favicon") {
        res.setHeader("Content-Type", "image/x-icon");
        payloadString = typeof payload !== undefined ? payload : "";
      }

      if (contentType === "css") {
        res.setHeader("Content-Type", "text/css");
        payloadString = typeof payload !== undefined ? payload : "";
      }

      if (contentType === "png") {
        res.setHeader("Content-Type", "image/png");
        payloadString = typeof payload !== undefined ? payload : "";
      }

      if (contentType === "jpg") {
        res.setHeader("Content-Type", "image/jpeg");
        payloadString = typeof payload !== undefined ? payload : "";
      }
      if (contentType === "text/javascript") {
        res.setHeader("Content-Type", "text/javascript");
        payloadString = typeof payload !== undefined ? payload : "";
      }
      if (contentType === "plain") {
        res.setHeader("Content-Type", "text/plain");
        payloadString = typeof payload !== undefined ? payload : "";
      }
      // return the response parts that are common to all content-types
      res.writeHead(statusCode);
      res.end(payloadString);
      // if the response is 200, print green otherwise print red
      if (statusCode == 200) {
        debug(
          "\x1b[32m%s\x1b[0m",
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      } else {
        debug(
          "\x1b[31m%s\x1b[0m",
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      }
    });
  });
};

// Define a request router
server.router = {
  "": handlers.index,
  "account/create": handlers.accountCreate,
  "account/edit": handlers.accountEdit,
  "account/deleted": handlers.accountDeleted,
  "session/create": handlers.sessionCreate,
  "session/deleted": handlers.sessionDeleted,
  "checks/all": handlers.checksList,
  "checks/create": handlers.checksCreate,
  "checks/edit": handlers.checksEdit,
  ping: handlers.ping,
  "api/users": handlers.user,
  "api/tokens": handlers.tokens,
  "api/checks": handlers.checks,
  "favicon.ico": handlers.favicon,
  public: handlers.public
};

// Instantiate the HTTP server
server.httpServer = http.createServer(server.unifiedServer);

// Instantiate the HTTPS server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem"))
};
server.httpsServer = https.createServer(
  server.httpsServerOptions,
  server.unifiedServer
);

// Init server
server.init = function() {
  // Start the http server
  server.httpServer.listen(config.httpPort, function() {
    console.log(
      "\x1b[36m%s\x1b[0m",
      "The server is listening on port " + config.httpPort
    );
  });

  // Start the https server
  server.httpsServer.listen(config.httpsPort, function() {
    console.log(
      "\x1b[35m%s\x1b[0m",
      "The server is listening on port " + config.httpsPort
    );
  });
};
module.exports = server;
