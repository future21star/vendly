var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');

var eventInviteSchema = new mongoose.Schema({
    accepted: String,
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('EventInvite', eventInviteSchema);
