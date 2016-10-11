var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var hbs = require('nodemailer-express-handlebars');
var fs = require('fs');
var User = mongoose.model('User');
var Contact = mongoose.model('Contact');
var Event = mongoose.model('Event');
var Booklet = mongoose.model('Booklet');

var auth = {
  auth: {
    api_key: 'key-5d8054dd4051083b2ae9565c3bdfef8b',
    domain: 'sandbox4c02a6e604144b7dbab5f9c69b0fb805.mailgun.org'
  }
}
var nodemailerMailgun = nodemailer.createTransport(mg(auth));

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

module.exports.sendEmail = function (req, res) {
    
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        
        var mailOptions = {
            from: 'Vendly <info@vendly.com>',
            to: req.body.email,
            subject: "Welcome to Vendly",
            html: "Welcome to Vendly"
        };
        
        nodemailerMailgun.sendMail(mailOptions, function(error, info) {
            if(error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        }); 
        
        res.json(req.body.email);
    }
};

module.exports.sendNewUserInviteEmail = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        
        var options = {
            viewEngine: {
                extname: '.hbs',
                layoutsDir: 'views/email/',
                defaultLayout : 'welcome_email'
            },
            viewPath: 'views/email/',
            extName: '.hbs'
        };
        nodemailerMailgun.use('compile', hbs(options));
        
        var mailOptions = {
            from: 'Vendly <info@vendly.com>',
            to: req.body.email,
            subject: "Welcome to Vendly!",
            template: 'welcome_email',
            context: {
                firstname: req.body.firstname
            }
        };
        
        nodemailerMailgun.sendMail(mailOptions, function(error, info) {
            if(error) {
                return console.log(error);
            }
            console.log('Message sent: ' + JSON.stringify(info));
        }); 
        
        res.json(req.body.email);
    }
};