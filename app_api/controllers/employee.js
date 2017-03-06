var mongoose = require('mongoose');
var User = mongoose.model('User');
var Employee = mongoose.model('Employee');

module.exports = {
    saveEmployee: function(req, res) {

        if (!req.payload._id) {
            res.status(401).json({ "message": "UnauthorizedError: private profile" });
        } else {

            User.find({ email: req.body.email }, function(err, docs) {
                if (!docs.length) { // if no user
                    // create unconfirmed user
                    // create employee row
                    // send new user employee email
                } else {
                    // create employee row
                    var employee = new Employee({
                        permission: req.body.permission,
                        title: req.body.title,
                        manager: req.payload._id,
                        employee: docs[0]._id
                    });

                    employee.save(function(err) {
                        if (err) {
                            res.status(409).json({ "message": err });
                        } else {
                            res.status(200).json(employee);
                        }
                    });

                    // send employee email
                    // TODO
                }
            });
        }

    },

    getEmployees: function(req, res) {
        if (!req.payload._id) {
            res.status(401).json({ "message": "UnauthorizedError: private profile" });
        } else {
            // get all employees rows with input manager user
            Employee
                .find({ manager: req.payload._id })
                .populate('manager')
                .populate('employee')
                .exec(function(err, employees) {
                    if (err) {
                        res.status(409).json({ "message": err });
                    } else {
                        res.status(200).json(employees);
                    }
                });
        }
    },

    updateEmployees: function(req, res) {
        if (!req.payload._id) {
            res.status(401).json({ "message": "UnauthorizedError: private profile" });
        } else {
            // update all employee rows with new permissions
        }
    }
};