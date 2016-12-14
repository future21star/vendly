var User = mongoose.model('User');
var File = mongoose.model('File');

module.exports.saveFileName = function (req, res) {

    if (!req.payload._id) {
        res.status(401).json({"message" : "UnauthorizedError: private profile"});
    } else {
        User.findById(req.payload._id, function(err, user) {
            if (err) res.status(409).json({"message" : err});

            var file = new Event({
                _owner: user._id,
                name: req.body.filename
            });

            file.save(function (err) {
                if (err) res.status(409).json({"message" : err});
            });

            user.files.push(file);
            user.save(function (err) {
                if (err) res.status(409).json({"message" : err});
                res.send(user);
            });
        });
    }

};