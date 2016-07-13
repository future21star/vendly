var mongoose = require('mongoose');
var User = mongoose.model('User');
var Contact = mongoose.model('Contact');
var Event = mongoose.model('Event');
var Booklet = mongoose.model('Booklet');

module.exports.profileRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
      User
        .findById(req.payload._id)
        .exec(function(err, user) {
            if (err) {
                res.status(409).json({
                    "message" : err
                });
            }
          
            res.status(200).json(user);
        });
  }

};

module.exports.rolodexRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
      User
        .findById(req.payload._id)
        .populate('contacts')
        .exec(function(err, user) {
            if (err) {
                res.status(409).json({
                    "message" : err
                });
            }
          
            res.status(200).json(user.contacts);
        });
  }

};

module.exports.saveContact = function(req, res) {
    
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        
        User.findById(req.payload._id, function(err, user) {
            if (err) {
                res.status(409).json({
                    "message" : err
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

            contact.save(function (err) {
                if (err) {
                    res.status(409).json({
                        "message" : err
                    });
                }
            });
            
            user.contacts.push(contact);    
            user.save(function (err) {
                if (err) {
                    res.status(409).json({
                        "message" : err
                    });
                }
                res.send(user);
            });
            
        });

    }
    
};

module.exports.calendarRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
      User
        .findById(req.payload._id)
        .populate('events')
        .exec(function(err, user) {
            if (err) {
                res.status(409).json({
                    "message" : err
                });
            }
          
            res.status(200).json(user.events);
        });
  }

};

module.exports.saveEvent = function(req, res) {
    
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        
        User.findById(req.payload._id, function(err, user) {
            if (err) {
                res.status(409).json({
                    "message" : err
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

            event.save(function (err) {
                if (err) {
                    res.status(409).json({
                        "message" : err
                    });
                }
            });
            
            user.events.push(event);    
            user.save(function (err) {
                if (err) {
                    res.status(409).json({
                        "message" : err
                    });
                }
                res.send(user);
            });
            
        });

    }
    
};


module.exports.bookletRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
      User
        .findById(req.payload._id)
        .populate('booklets')
        .exec(function(err, user) {
            if (err) {
                res.status(409).json({
                    "message" : err
                });
            }
          
            res.status(200).json(user.booklets);
        });
  }

};

module.exports.saveBooklet = function(req, res) {
    
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        
        User.findById(req.payload._id, function(err, user) {
            if (err) {
                res.status(409).json({
                    "message" : err
                });
            }

            var booklet = new Booklet({
                _owner: user._id,
                title: req.body.title,
                content: req.body.content
            });

            booklet.save(function (err) {
                if (err) {
                    res.status(409).json({
                        "message" : err
                    });
                }
            });
            
            user.booklets.push(booklet);    
            user.save(function (err) {
                if (err) {
                    res.status(409).json({
                        "message" : err
                    });
                }
                res.send(user);
            });
            
        });

    }
    
};