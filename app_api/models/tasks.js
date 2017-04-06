var mongoose = require('mongoose');
var User = mongoose.model('User');

var tasksSchema = new mongoose.Schema({
    _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    done: Boolean,
    description: String,
    visibility: String
});

mongoose.model('Task', tasksSchema);
