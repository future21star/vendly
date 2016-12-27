var mongoose = require('mongoose');
var Contact = mongoose.model('Contact');
var Booklet = mongoose.model('Booklet');

var viewBookletSchema = new mongoose.Schema({
    access: String,
    booklet: { type: mongoose.Schema.Types.ObjectId, ref: 'Booklet' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }
});

mongoose.model('ViewBooklet', viewBookletSchema);
