// import packages and modules
const authResolver = require('./auth');
const eventResolver = require('./event');
const bookingResolver = require('./booking');
const userResolver = require('./user');

// merge the module in 1 object to exports
const rootResolver = {
    ...userResolver,
    ...authResolver,
    ...bookingResolver,
    ...eventResolver
};

// export object as module
module.exports = rootResolver;