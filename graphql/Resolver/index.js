// import packages and modules
const authResolver = require('./auth');
const eventResolver = require('./event');
const bookingResolver = require('./booking');


// merge the module in 1 object to exports
const rootReslver = {
    ...authResolver,
    ...bookingResolver,
    ...eventResolver
};

// export object as module
module.exports = rootReslver;