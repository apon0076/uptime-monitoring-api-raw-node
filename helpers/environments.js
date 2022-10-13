// module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3001,
    envName: 'staging',
};

// production environment
environments.production = {
    port: 5001,
    envName: 'production',
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = environmentToExport;
