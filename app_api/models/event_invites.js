var mongoose = require('mongoose');
var Contact = mongoose.model('Contact');
var Event = mongoose.model('Event');

var eventInviteSchema = new mongoose.Schema({
    accepted: String,
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }
});

mongoose.model('EventInvite', eventInviteSchema);
