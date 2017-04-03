var mongoose = require('mongoose');
var User = mongoose.model('User');
var Task = mongoose.model('Task');

module.exports = {
    saveTask: function(req, res) {

        if (!req.payload._id) {
            res.status(401).json({ "message": "UnauthorizedError: private profile" });
        } else {

            User.findById(req.payload._id, function(err, user) {
                if (err) res.status(409).json({ "message": err });

                var task = new Task({
                    _owner: user._id,
                    done: false,
                    description: req.body.description,
                    visibility: req.body.visibility
                });

                task.save(function(err) {
                    if (err) res.status(409).json({ "message": err });
                });

            });

        }

    },

    getTasks: function(req, res) {
        if (!req.payload._id) {
            res.status(401).json({ "message": "UnauthorizedError: private profile" });
        } else {

            // TODO
            // if manager
                // get all managers tasks
                // get all employees public tasks
            // if employee
                // get all employees tasks
                // get all managers and other employees tasks

            Task
                .find({ _owner: req.payload._id })
                .exec(function(err, tasks) {
                    if (err) {
                        res.status(409).json({ "message": err });
                    } else {
                        res.status(200).json(tasks);
                    }
                });
        }
    },

    updateTask: function(req, res) {
        if (!req.payload._id) {
            res.status(401).json({ "message": "UnauthorizedError: private profile" });
        } else {
            Task
                .findOneAndUpdate(
                    {
                        _id: req.body._id
                    },
                    {
                        done: req.body.done,
                        description: req.body.description,
                        visibility: req.body.visibility
                    },
                    function(err, task) {
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

    deleteTask: function(req, res) {
        // TODO
    }
};