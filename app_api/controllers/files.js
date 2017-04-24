var mongoose = require('mongoose');
var User = mongoose.model('User');
var File = mongoose.model('File');

module.exports = {

    saveFile: function(req, res) {

        if (!req.payload._id) {
            res.status(401).json({ "message": "UnauthorizedError: private profile" });
        } else {
            User.findById(req.payload._id, function(err, user) {
                if (err) res.status(409).json({ "message": err });

                var file = new File({
                    _owner: user._id,
                    name: req.body.filename,
                    uploaded: req.body.uploaded
                });

                file.save(function(err) {
                    if (err) res.status(409).json({ "message": err });
                });

                user.files.push(file);
                user.save(function(err) {
                    if (err) res.status(409).json({ "message": err });
                    res.send(user);
                });
            });
        }

    },

    getFiles: function(req, res) {
        if (!req.payload._id) {
            res.status(401).json({ "message": "UnauthorizedError: private profile" });
        } else {
            User
                .findById(req.payload._id)
                .populate('files')
                .exec(function(err, user) {
                    if (err) {
                        res.status(409).json({
                            "message": err
                        });
                    }

                    res.status(200).json(user.files);
                });
        }
    }
};