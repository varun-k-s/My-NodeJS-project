const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum passowrd length is 6 characters']
    }
});

// fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
  console.log('new user was created & saved', doc);
  next();
});

// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to log in the user (this is called using User.login() in the authController.js file).
userSchema.statics.login = async function (email, password) {

    // here, "this" will refer to the 'User' mongoose model which we are exporting, because we 
    // referred to this function (which is a static method) via "User".login() in the authControllers.js file.

    const user = await this.findOne({ email });
    if (!user) throw Error('incorrect email'); //this error message will be shown in the server console (terminal), not the browser console.

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) throw Error('incorrect password'); //this error message will be shown in the server console (terminal), not the browser console.

    return user;

    // When we validate email and password, it's a good idea not 
    // to send separate messages like "incorrect email" and "incorrect password". 
    // Send "Incorrect email or password" to preserve user privacy. Otherwise, if we enter 
    // an existing email in the database with any password, we will easily know that you
    // have an account on the website.
}

const User = mongoose.model('user', userSchema);

module.exports = User;