var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = process.env.MY_SECRET;

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        required: true
    },
    phone: String,
    bus_name: String,
    website: String,
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    active_booklet: { type: mongoose.Schema.Types.ObjectId, ref: 'Booklet' },
    booklets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booklet' }],
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    hash: String,
    salt: String
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000)
    }, secret);
};

mongoose.model('User', userSchema);