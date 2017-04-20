/**
 * Created by Adam on 3/29/17.
 */
var mongoose = require('mongoose');
var Contact = mongoose.model('Contact');
var User = mongoose.model('User');

module.exports = {
  createContact: function (req, res) {

    if (!req.payload._id) {
      res.status(401).json({
        "message": "UnauthorizedError: private profile"
      });
    } else {

      User.findById(req.payload._id, function (err, user) {
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

        contact.save(function (err) {
          if (err) {
            res.status(409).json({
              "message": err
            });
          }
        });

        user.contacts.push(contact);
        user.save(function (err) {
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

  updateContact: function (req, res) {
    if (!req.payload._id) {
      res.status(401).json({
        "message": "UnauthorizedError: private profile"
      });
    } else {
      Contact.findById(req.body._id, function (err, contact) {
        if (err) {
          res.status(500).json({"message": err})
          return
        }

        if (contact._owner != req.payload._id) {
          res.status(401).json({
            "message": "Only the owner of the contact can update it"
          })
        } else {
          //Can the email be updated?
          Contact.findOneAndUpdate({_id: req.body._id}, {
            name: req.body.name,
            weddingdate: req.body.weddingdate,
            balanceDue: req.body.balanceDue,
            phone: req.body.phone
          }, function (err, contact) {
            if (err) {
              res.status(409).json({"message": err});
            } else {
              res.status(200).json(contact);
            }
          })
        }
      });

    }
  },

  getContact: function (req, res) {
    if (!req.payload._id) {
      res.status(401).json({
        "message": "UnauthorizedError: private profile"
      });
    } else {
      Contact.findById(req.params.clientId, function (err, contact) {
        if (err) {
          res.status(500).json({"message": err});
          return
        }

        if (contact._owner != req.payload._id) {
          res.status(401).json({
            "message": "Only the owner of the contact can update it"
          })
        } else {
          res.status(200).json(contact)
        }
      });

    }
  }
};