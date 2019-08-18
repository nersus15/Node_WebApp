// import packages and modules or function
const jwt = require('jsonwebtoken');


// create logic to verify token and export as module
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, '102408');
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next()
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    req.username = decodedToken.username;
    req.email = decodedToken.email
    next()
};