var mongoose = require('mongoose');
var User = mongoose.model('User');
var Contact = mongoose.model('Contact');

module.exports.profileRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
      User
        .findById(req.payload._id)
        .exec(function(err, user) {
            res.status(200).json(user);
        });
  }

};

//module.exports.rolodexRead = function(req, res) {
//
//  if (!req.payload._id) {
//    res.status(401).json({
//      "message" : "UnauthorizedError: private profile"
//    });
//  } else {
//      User
//        .findById(req.payload._id)
//        .populate('contacts')
//        .exec(function(err, user) {
//            res.status(200).json(user);
//        });
//  }
//
//};

module.exports.saveContact = function(req, res) {
    
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        
//        var contact = new Contact({
//            name: req.body.name,
//            email: req.body.email,
//            _owner: req.payload._id  
//        });
//
//        contact.save(function(err) {
//            res.status(200);
//            res.json(contact);
//        });
//        
//        var user = User.findById(req.payload._id);
        
        
        User.findById(req.payload._id, function(err, user) {
            if (err) {
                    res.status(409).json({
                        "message" : err
                    });
                }

            var contact = new Contact({
                name: req.body.name,
                email: req.body.email,
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