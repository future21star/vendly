var mongoose = require('mongoose');
var User = mongoose.model('User');
var Notification = mongoose.model('Notification');

module.exports.getNotifications = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({"message": "UnauthorizedError: private profile"});
    } else {
        Notification
            .find({_owner: req.payload._id})
            .exec(function(err, notifications) {
                if (err) {
                    res.status(409).json({"message" : err});
                } else {
                    res.status(200).json(notifications);
                }
            });
    }
};

module.exports.updateNotifications = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({"message": "UnauthorizedError: private profile"});
    } else {
        Notification
            .findOneAndUpdate(
                { _owner: req.payload._id },
                {
                    deadlines: req.body.deadlines,
                    push_deadlines: req.body.push_deadlines,
                    handbook_access: req.body.handbook_access,
                    push_handbook_access: req.body.push_handbook_access,
                    events_changed: req.body.events_changed,
                    push_events_changed: req.body.push_events_changed,
                    payments: req.body.payments,
                    push_payments: req.body.push_payments,
                    messages: req.body.messages,
                    push_messages: req.body.push_messages,
                    product_updates: req.body.product_updates,
                    push_product_updates: req.body.push_product_updates,
                    third_party_msg: req.body.third_party_msg,
                    push_third_party_msg: req.body.push_third_party_msg,
                    updated_at: new Date()
                },
                function(err) {
                    if (err) {
                        res.status(409).json({ "message" : err });
                    } else {
                        res.status(200).json();
                    }
                }
            );
    }
};