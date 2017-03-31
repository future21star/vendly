/**
 * Created by Adam on 3/29/17.
 */
var mongoose = require('mongoose');
var Contact = mongoose.model('Contact');
var User = mongoose.model('User');

module.exports = {
  getClient: function (req, res) {
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