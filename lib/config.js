/**
 * Create and export configutation variables
 *
 */

//  Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  hashSecret: "thisIsASecret",
  maxChecks: 5,
  twilio: {
    accountSid: "ACaf5f5cfcc33a28ed02f87cd65868e1f8",
    authToken: "08cafbf82b054b7ab1083dc2db3cfcbd",
    fromPhone: "+17324020372"
  },
  templateGlobals: {
    appName: "Update Checker",
    companyName: "NotARealCompany, Inc",
    yearCreated: "2018",
    baseUrl: "http://localhost:3000"
  }
};

// Production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashSecret: "thisIsAlsoASecret",
  maxChecks: 5,
  twilio: {
    accountSid: "ACaf5f5cfcc33a28ed02f87cd65868e1f8",
    authToken: "08cafbf82b054b7ab1083dc2db3cfcbd",
    fromPhone: "+17324020372"
  },
  templateGlobals: {
    appName: "Update Checker",
    companyName: "NotARealCompany, Inc",
    yearCreated: "2018",
    baseUrl: "http://localhost:5000"
  }
};

// Determine which environment was passed as a command-line argument
const currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// Check that the current  environment is one of the environments above, if not, default is staging
const environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
