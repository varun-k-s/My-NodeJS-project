const jwt = require("jsonwebtoken");
const User = require('../models/User.js');

// this function can be placed in front of any route that requires authentication, 
// that is only authenticated users can access that route
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt_cookie;

    // check JWT exists and is verified
    if (token) {
        jwt.verify(token, 'varun-secret', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect('/login');
    }
}

// check the current user
// checkUser helps us to access 'myuser' as a variable in our views using res.locals.
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt_cookie;
    if (token) {
        jwt.verify(token, 'varun-secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.myuser = null;
                next();
            }
            else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.myuser = user;
                next();
            }
        });
    }
    else {
        res.locals.myuser = null;
        next();
    };
};

module.exports = { requireAuth, checkUser };