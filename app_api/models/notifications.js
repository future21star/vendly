var mongoose = require('mongoose');
var User = mongoose.model('User');

var notificationSchema = new mongoose.Schema({
    _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deadlines: String,
    push_deadlines: Boolean,
    handbook_access: String,
    push_handbook_access: Boolean,
    events_changed: String,
    push_events_changed: Boolean,
    payments: String,
    push_payments: Boolean,
    messages: String,
    push_messages: Boolean,
    product_updates: String,
    push_product_updates: Boolean,
    third_party_msg: String,
    push_third_party_msg: Boolean,
    created_at: Date,
    updated_at: Date
});

mongoose.model('Notification', notificationSchema);
