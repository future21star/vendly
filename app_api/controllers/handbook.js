var mongoose = require('mongoose');
var User = mongoose.model('User');
var Booklet = mongoose.model('Booklet');

module.exports.bookletRead = function (req, res) {

    if (!req.payload._id) {
        res.status(401).json({"message": "UnauthorizedError: private profile"});
    } else {
        User
            .findById(req.payload._id)
            .populate('booklets')
            .exec(function (err, user) {
                if (err)
                    res.status(409).json({"message": err});

                res.status(200).json(user.booklets);
            });
    }

};

module.exports.saveBooklet = function (req, res) {

    if (!req.payload._id) {
        res.status(401).json({"message": "UnauthorizedError: private profile"});
    } else {

        User.findById(req.payload._id, function (err, user) {
            if (err)
                res.status(409).json({"message": err});

            var booklet = new Booklet({
                _owner: user._id,
                title: req.body.title,
                content: req.body.content,
                updated_date: new Date()
            });

            booklet.save(function (err) {
                if (err)
                    res.status(409).json({"message": err});
            });

            user.booklets.push(booklet);
            if (!user.active_booklet)
                user.active_booklet = booklet;

            user.save(function (err) {
                if (err)
                    res.status(409).json({"message": err});

                res.status(200).json();
            });

        });

    }

};

module.exports.updateBooklet = function (req, res) {

    if (!req.payload._id) {
        res.status(401).json({"message": "UnauthorizedError: private profile"});
    } else {
        Booklet.findOneAndUpdate(
            {_id: req.body._id},
            {
                title: req.body.title,
                content: req.body.content,
                updated_date: req.body.updated_date
            },
            function (err) {
                if (err)
                    res.status(409).json({"message": err});

                res.status(200).json();
            }
        );
    }

};

module.exports.setActiveHandbook = function (req, res) {

    if (!req.payload._id) {
        res.status(401).json({"message": "UnauthorizedError: private profile"});
    } else {
        User.findOneAndUpdate(
            { _id: req.payload._id },
            { active_booklet: req.body._id },
            function (err) {
                if (err)
                    res.status(409).json({"message": err});

                res.status(200).json();
            }
        );
    }

};

module.exports.getActiveHandbook = function (req, res) {

    if (!req.payload._id) {
        res.status(401).json({"message": "UnauthorizedError: private profile"});
    } else {
        User
            .findById(req.payload._id)
            .populate('active_booklet')
            .exec(function (err, user) {
                if (err)
                    res.status(409).json({"message": err});

                res.status(200).json(user.active_booklet);
            });
    }

};
