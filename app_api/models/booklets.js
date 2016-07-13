var mongoose = require('mongoose');
var User = mongoose.model('User');

var bookletSchema = new mongoose.Schema({
    _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: {
        type: String,
        required: true
    },
    content: String
});

mongoose.model('Booklet', bookletSchema);
