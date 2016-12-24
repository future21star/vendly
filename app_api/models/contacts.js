var mongoose = require('mongoose');
var User = mongoose.model('User');

var contactSchema = new mongoose.Schema({
    _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: {
        type: String,
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
