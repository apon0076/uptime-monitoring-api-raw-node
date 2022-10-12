//module scaffolding
const environments = {};

environments.staging = {
  port: 3001,
  envName: "staging",
};
environments.production = {
  port: 5001,
  envName: "production",
};

// determine which environment passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
