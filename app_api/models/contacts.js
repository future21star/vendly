var mongoose = require('mongoose');
//var User = mongoose.model('User');

var contactSchema = new mongoose.Schema({
    _owner: { type: Number, ref: 'User' },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    weddingdate: Date,
    phone: String,
    balanceDue: Number
});

mongoose.model('Contact', contactSchema);
