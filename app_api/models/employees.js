var mongoose = require('mongoose');
var User = mongoose.model('User');
var Booklet = mongoose.model('Booklet');

var viewBookletSchema = new mongoose.Schema({
    access: String,
    booklet: { type: mongoose.Schema.Types.ObjectId, ref: 'Booklet' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('ViewBooklet', viewBookletSchema);
