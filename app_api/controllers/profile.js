// TODO: pull these out into separate files
var mongoose = require('mongoose');
var hbs = require('nodemailer-express-handlebars');
var User = mongoose.model('User');
var Contact = mongoose.model('Contact');
var Event = mongoose.model('Event');
var Booklet = mongoose.model('Booklet');

var auth = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
};

module.exports = {

    profileRead: function(req, res) {

        if (!req.payload._id) {
            res.status(401).json({
                "message": "UnauthorizedError: private profile"
            });
        } else {
            User
                .findById(req.payload._id)
                .exec(function(err, user) {
                    if (err) {
                        res.status(409).json({
                            "message": err
                        });
                    }

                    res.status(200).json(user);
                });
        }

    },

    updateProfile: function(req, res) {

        if (!req.payload._id) {
            res.status(401).json({
                "message": "UnauthorizedError: private profile"
            });
        } else {
            User.findOneAndUpdate({
                    _id: req.payload._id
                }, {
                    name: req.body.name,
                    email: req.body.email,
                    usertype: req.body.usertype,
                    phone: req.body.phone,
                    bus_name: req.body.bus_name,
                    website: req.body.website
                },
                function(err, user) {
                    if (err) {
                        res.status(409).json({
                            "message": err
                        });
                    } else {
                        res.status(200).json();
                    }
                }
            );
        }
    },

    rolodexRead: function(req, res) {

        if (!req.payload._id) {
            res.status(401).json({
                "message": "UnauthorizedError: private profile"
            });
        } else {
            User
                .findById(req.payload._id)
                .populate('contacts')
                .exec(function(err, user) {
                    if (err) {
                        res.status(409).json({
                            "message": err
                        });
                    }

                    res.status(200).json(user.contacts);
                });
        }

    },

    saveContact: function(req, res) {

        if (!req.payload._id) {
            res.status(401).json({
                "message": "UnauthorizedError: private profile"
            });
        } else {

            User.findById(req.payload._id, function(err, user) {
                if (err) {
                    res.status(409).json({
                        "message": err
                    });
                }

                var contact = new Contact({
                    name: req.body.name,
                    email: req.body.email,
                    weddingdate: req.body.weddingdate,
                    balanceDue: req.body.balanceDue,
                    phone: req.body.phone,
                    _owner: user._id
                });

                contact.save(function(err) {
                    if (err) {
                        res.status(409).json({
                            "message": err
                        });
                    }
                });

                user.contacts.push(contact);
                user.save(function(err) {
                    if (err) {
                        res.status(409).json({
                            "message": err
                        });
                    }
                    res.send(user);
                });

            });

        }

    },

    updateContact: function(req, res) {
      if (!req.payload._id) {
        res.status(401).json({
          "message": "UnauthorizedError: private profile"
        });
      } else {
            var contact = Contact.find({_id: req.body._id });
            if (contact._owner._id != req.payload._id) {
                res.status(401).json({
                    "message": "Only the owner of the contact can update it"
                })
            } else {
                // Can the email be updated?
                Contact.findOneAndUpdate({ _id: req.body._id}, {
                  name: req.body.name,
                  weddingdate: req.body.weddingdate,
                  balanceDue: req.body.balanceDue,
                  phone: req.body.phone
                }, function(err) {
                  if (err)
                    res.status(409).json({ "message": err });

                  res.status(200).json();
                })
            }
      }
    },

    calendarRead: function(req, res) {

        if (!req.payload._id) {
            res.status(401).json({
                "message": "UnauthorizedError: private profile"
            });
        } else {
            User
                .findById(req.payload._id)
                .populate('events')
                .exec(function(err, user) {
                    if (err) {
                        res.status(409).json({
                            "message": err
                        });
                    }

                    res.status(200).json(user.events);
                });
        }

    },

    saveEvent: function(req, res) {

        if (!req.payload._id) {
            res.status(401).json({
                "message": "UnauthorizedError: private profile"
            });
        } else {

            User.findById(req.payload._id, function(err, user) {
                if (err) {
                    res.status(409).json({
                        "message": err
                    });
                }

                var event = new Event({
                    _owner: user._id,
                    title: req.body.title,
                    allDay: req.body.allDay,
                    start: req.body.start,
                    end: req.body.end,
                    url: req.body.url,
                    description: req.body.description
                });

                event.save(function(err) {
                    if (err) {
                        res.status(409).json({
                            "message": err
                        });
                    }
                });

                user.events.push(event);
                user.save(function(err) {
                    if (err) {
                        res.status(409).json({
                            "message": err
                        });
                    } else {
                        res.status(200).json(user);
                    }
                });

            });

        }

    },

    updateEvent: function(req, res) {

        if (!req.payload._id) {
            res.status(401).json({
                "message": "UnauthorizedError: private profile"
            });
        } else {
            Event.findOneAndUpdate({
                    _id: req.body._id
                }, {
                    title: req.body.title,
                    start: req.body.start,
                    end: req.body.end,
                    description: req.body.description
                },
                function(err, event) {
                    if (err) {
                        res.status(409).json({
                            "message": err
                        });
                    } else {
                        res.status(200).json();
                    }
                }
            );
        }
    }
};