/**
 * Frontend logic for application
 */

const app = {};

// Config
app.config = {
  sessionToken: false
};

// AJAX client (for the restfull api)
app.client = {};

// Interface for making API calls
app.client.request = function (
  headers,
  path,
  method,
  queryStringObject,
  payload,
  callback
) {
  // Set default
  headers = typeof headers === "object" && headers !== null ? headers : {};
  path = typeof path === "string" ? path : "/";
  method =
    typeof method === "string" &&
      ["GET", "POST", "PUT", "DELETE"].indexOf(method) > -1
      ? method.toLocaleUpperCase()
      : "GET";
  queryStringObject =
    typeof queryStringObject === "object" && queryStringObject !== null
      ? queryStringObject
      : {};
  payload = typeof payload === "object" && payload !== null ? payload : {};
  callback = typeof callback === "function" ? callback : false;

  // For Each query string parameter sent, add it to path
  let requestUrl = path + "?";
  let counter = 0;
  for (let queryKey in queryStringObject) {
    if (queryStringObject.hasOwnProperty(queryKey)) {
      counter++;
      // If at least one query string parameter has already been added, prepend new ones with &
      if (counter > 1) {
        requestUrl += "&";
      }
      // Add the key and value
      requestUrl += queryKey + "=" + queryStringObject[queryKey];
    }
  }

  // form the http request as a JSON type
  const xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  // for each header sent, add it to request
  for (let headerKey in headers) {
    if (headers.hasOwnProperty(headerKey)) {
      xhr.setRequestHeader(headerKey, headers[headerKey]);
    }
  }
  // if there is a current session token set, addd that as a header
  if (app.config.sessionToken) {
    xhr.setRequestHeader("token", app.config.sessionToken.id);
  }

  // response
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const statusCode = xhr.status;
      const response = xhr.responseText;

      // callback if requested
      if (callback) {
        try {
          const parsedResponse = JSON.parse(response);
          callback(statusCode, parsedResponse);
        } catch (error) {
          callback(statusCode, false);
        }
      }
    }
  };

  // Send the payload as JSON
  let payloadString = JSON.stringify(payload);
  xhr.send(payloadString);
};

// bind the forms
app.bindForms = function () {
  if (document.querySelector("form")) {
    document.querySelector("form").addEventListener("submit", function (e) {
      // Stop it from submitting
      e.preventDefault();
      const formId = this.id;
      const path = this.action;
      let method = this.method.toUpperCase();
      console.log(typeof this._method.value)
      const _method = this._method.value !== null ? this._method.value : "";
      if (_method === "PUT" || _method === "DELETE") {
        method = _method.toUpperCase();
      } else {
        method = this.method.toUpperCase();
      }
      // console.log(formId, path, method);

      // Hide the error message (if it's shown due to a previous error)
      document.querySelector("#" + formId + " .formError").style.display =
        "hidden";

      // Turn the inputs into a payload
      const payload = {};
      const elements = this.elements;
      // console.log(this);
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].type !== "submit") {
          let valueOfElement =
            elements[i].type == "checkbox"
              ? elements[i].checked
              : elements[i].value;
          payload[elements[i].name] = valueOfElement;
        }
      }
      console.log(payload, method);
      // console.log(payload);

      // Call the API
      app.client.request(undefined, path, method, undefined, payload, function (
        statusCode,
        responsePayload
      ) {
        // Display an error on the form if needed
        if (statusCode !== 200) {
          // Try to get an error from API or set a default error
          const error =
            typeof responsePayload.Error == "string"
              ? responsePayload.Error
              : "Some error";
          // Set the formError field with the error text
          document.querySelector(
            "#" + formId + " .formError"
          ).innerHTML = error;

          // Show (unhide) the formError field
          document.querySelector("#" + formId + " .formError").style.display =
            "block";
          app.removeAlert();
        } else {
          // if successful, send to form response processor
          app.formResponseProcessor(formId, payload, responsePayload);
        }
      });
    });
  }
};

app.formResponseProcessor = function (formId, requestPayload, responsePayload) {
  const functionToCall = false;
  // If account creation was successfull, try to immediately log the user in
  if (formId == "accountCreate") {
    // Take the phone and password, and used it to log in the user
    const newPayload = {
      phone: requestPayload.phone,
      password: requestPayload.password
    };

    app.client.request(
      undefined,
      "api/tokens",
      "POST",
      undefined,
      newPayload,
      function (newStatusCode, newResponsePayload) {
        if (newStatusCode !== 200) {
          // Set the formError field with the error text
          document.querySelector("#" + formId + " .formError").innerHTML =
            "Sorry an error occured";
          // show the formError field
          document.querySelector("#" + formId + " .formError").style.display =
            "block";
          app.removeAlert();
        } else {
          // if successfull, set the user and redirect the user
          app.setSessionToken(newResponsePayload);
          window.location = "/checks/all";
        }
      }
    );
  }

  // If login was successfull, set the token in localstorage and redirect the user
  if (formId === "sessionCreate") {
    app.setSessionToken(responsePayload);
    window.location = "/checks/all";
  }
  const formWithSuccessMessage = ['accountEdit1', 'accountEdit2'];
  if (formWithSuccessMessage.indexOf(formId) > -1) {
    document.querySelector("#" + formId + " .formSuccess").style.display = "block";
    app.removeAlert();
  }

  if (formId == "accountEdit3") {
    app.logUserOut(false);
    window.location = '/account/deleted';
  }
};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function () {
  const tokenString = localStorage.getItem("token");
  if (typeof tokenString === "string") {
    try {
      const token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      if (typeof token === "object") {
        app.setLoggedinClass(true);
      } else {
        app.setLoggedinClass(false);
      }
    } catch (error) {
      app.config.sessionToken = false;
      app.setLoggedinClass(false);
    }
  }
};

// Set (or remove) the loggenIn class from the body\
app.setLoggedinClass = function (add) {
  const target = document.querySelector("body");
  if (add) {
    target.classList.add("loggedIn");
  } else {
    target.classList.remove("loggedIn");
  }
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function (token) {
  app.config.sessionToken = token;
  const tokenString = JSON.stringify(token);
  localStorage.setItem("token", tokenString);
  if (typeof token === "object") {
    app.setLoggedinClass(true);
  } else {
    app.setLoggedinClass(false);
  }
};

// Renew the token
app.renewToken = function (callback) {
  const currentToken =
    typeof app.config.sessionToken === "object"
      ? app.config.sessionToken
      : false;
  if (currentToken) {
    // Update the token with expiration
    const payload = {
      id: currentToken.id,
      extent: true
    };
    app.client.request(
      undefined,
      "api/tokens",
      "PUT",
      undefined,
      payload,
      function (statusCode, responsePayload) {
        // Display an error on the form if needed
        if (statusCode === 200) {
          // Get the new token details
          const queryStringObject = { id: currentToken.id };
          app.client.request(
            undefined,
            "api/tokens",
            "GET",
            queryStringObject,
            undefined,
            function (statusCode, responsePayload) {
              // Display an error in the form if needed
              if (statusCode === 200) {
                app.setSessionToken(responsePayload);
                callback(false);
              } else {
                app.setSessionToken(false);
                callback(true);
              }
            }
          );
        } else {
          app.setSessionToken(false);
          callback(true);
        }
      }
    );
  } else {
    app.setSessionToken(false);
    callback(true);
  }
};

// Load to renew token often
app.tokenRenewLoop = function () {
  setInterval(function () {
    app.renewToken(function (err) {
      if (!err) {
        console.log("Token renewd successfully @ " + Date.now());
      }
    });
  }, 1000 * 60 * 60);
};

// Bind the logout button
app.bindLogoutButton = function () {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", function (e) {
      // Stop it from redirecting anywhere
      e.preventDefault();

      // log the user out
      app.logUserOut();
    });
  }
};

// log the user out then redirect them
app.logUserOut = function () {
  const tokenId =
    typeof app.config.sessionToken.id === "string"
      ? app.config.sessionToken
      : undefined;
  const queryStringObject = {
    id: tokenId
  };
  app.client.request(
    undefined,
    "api/tokens",
    "DELETE",
    queryStringObject,
    undefined,
    function () {
      // Set the app.config token as false
      app.setSessionToken(false);

      // Send the user to the logged out page
      window.location = "session/deleted";
    }
  );
};

app.loadDataOnPage = function () {
  const bodyClass = document.querySelector("body").classList;
  const primaryClass = typeof bodyClass[0] === "string" ? bodyClass[0] : false;
  if (primaryClass == "accountEdit") {
    app.loadAccountEditPage();
  }
};

app.loadAccountEditPage = function () {
  const phone =
    typeof app.config.sessionToken.phone === "string"
      ? app.config.sessionToken.phone
      : false;
  if (phone) {
    const queryStringObject = {
      phone: phone
    };
    app.client.request(
      undefined,
      "api/users",
      "GET",
      queryStringObject,
      undefined,
      function (statusCode, responsePayload) {
        if (statusCode === 200) {
          document.querySelector("#accountEdit1 .firstname").value =
            responsePayload.firstName;
          document.querySelector("#accountEdit1 .lastname").value =
            responsePayload.lastName;
          document.querySelector("#accountEdit1 .displayPhoneInput").value =
            responsePayload.phone;

          const hiddenPhoneInputs = document.querySelectorAll(
            "input.hiddenPhoneNumberInput"
          );
          for (let i = 0; i < hiddenPhoneInputs.length; i++) {
            hiddenPhoneInputs[i].value = responsePayload.phone;
          }
        } else {
          app.logUserOut;
        }
      }
    );
  } else {
    app.logUserOut();
  }
};

app.removeAlert = function () {
  setTimeout(function () {
    document.querySelector(".formSuccess").style.display = "none";
    document.querySelector(".formError").style.display = "none";
  }, 3000);
}
// Init (bootstrapping)
app.init = function () {
  // Bind all form submission
  app.bindForms();

  // Bind the logout Button
  app.bindLogoutButton();

  // Get the token from localstorage
  app.getSessionToken();

  // Renew token
  app.tokenRenewLoop();

  app.loadDataOnPage();

};

// Call the init process after the window loads
window.onload = function () {
  app.init();
};
