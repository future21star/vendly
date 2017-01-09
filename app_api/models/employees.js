var mongoose = require('mongoose');
var User = mongoose.model('User');

var employeeSchema = new mongoose.Schema({
    permission: String,
    title: String,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Employee', employeeSchema);
