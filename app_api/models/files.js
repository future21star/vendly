var mongoose = require('mongoose');
var User = mongoose.model('User');

var fileSchema = new mongoose.Schema({
    _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: {
        type: String,
        required: true
    },
    uploaded: Date
});

mongoose.model('File', fileSchema);
