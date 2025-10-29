// Here, const User is a 'mongoose model' that was exported from User.js file.
// Hence, you can directly use built in helper methods like like User.create(), User.findOne() etc.
// You can also create new static methods with custom names, like the User.login() method we use in this file.
// User.login() method was created by us in the User.js file.

const User = require('../models/User');
const jwt = require('jsonwebtoken')

// handler functions actually live inside this file

//handle errors: This function is for creating the exact error message that should be shown to the user in case of any error.
// This error msg will be sent as the response after the user posts some wrong data through signup.ejs.
// If you check the code in signup.ejs, you will see that this error msg ultimately reaches the variable 'data' declared there
// and gets logged in the browser console.

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let error_array = {email: '', password: ''};

    //duplicate error code
    if (err.code === 11000) {
        error_array.email = 'that email is already registered';
        return error_array;
    }

    // incorrect email or password during login (not signup)
    if (err.message === 'incorrect email' || err.message === 'incorrect password') {
        error_array.password = 'incorrect email and/or password';
    }

    // if (err.message === 'incorrect email') {
    //     error_array.email = 'incorrect email';
    // }
    // if (err.message === 'incorrect password') {
    //     error_array.password = 'incorrect password';
    // }

    //validation errors (during signup)
    if (err.message.includes('user validation failed')) {
        //Object.values(err.errors).forEach( error => {
            //console.log(error.properties);
        //})
        Object.values(err.errors).forEach( ({properties}) => {
            error_array[properties.path] = properties.message;
        })
    }
    
    return error_array;
}

const maxAge = 3*24*60*60;

// function to create JWT from user_id in the mongodb database
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });

// jwt.sign({ id }, 'secret', ...) is the same as writing jwt.sign({ id: id }, 'secret', ...)

};

module.exports.signup_get = (req, res) => {
    if (res.locals.myuser) res.redirect('/');
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    if (res.locals.myuser) res.redirect('/');
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password});
        const token = createToken(user._id);
        res.cookie('jwt_cookie', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user: user._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt_cookie', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt_cookie', '', { maxAge: 1 });
    res.redirect('/');
};