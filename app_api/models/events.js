var mongoose = require('mongoose');
var User = mongoose.model('User');

var eventSchema = new mongoose.Schema({
    _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: {
        type: String,
        required: true
    },
    allDay: Boolean,
    start: {
        type: Date,
        required: true
    },
    end: Date,
    url: String,
    description: String
});

mongoose.model('Event', eventSchema);
