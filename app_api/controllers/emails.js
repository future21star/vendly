// var nodemailer = require('nodemailer');
// var nodemailerMailgun = nodemailer.createTransport(mg(auth));
// var mg = require('nodemailer-mailgun-transport');
var superagent = require('superagent');
var config = require('../config/config');

var mailchimpInstance = config.mailchimpInstance,
    listUniqueId = config.listUniqueId,
    mailchimpApiKey = config.mailchimpApiKey;

module.exports = {

    signUpUser: function(req, res) {
        superagent
            .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
            .set('Content-Type', 'application/json;charset=utf-8')
            .set('Authorization', 'Basic ' + new Buffer('anystring:' + mailchimpApiKey).toString('base64'))
            .send({
                'email_address': req.body.email,
                'status': 'subscribed',
                'merge_fields': {
                    'FNAME': req.body.firstname,
                    'LNAME': req.body.lastname,
                    'USERTYPE': req.body.usertype
                }
            })
            .end(function(err, response) {
                if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                    res.send('Signed Up!');
                } else {
                    res.send('Sign Up Failed :(');
                }
            });
    },

    sendEmail: function(req, res) {

        // if (!req.payload._id) {
        //     res.status(401).json({
        //         "message": "UnauthorizedError: private profile"
        //     });
        // } else {
        //
        //     var mailOptions = {
        //         from: 'Vendly <info@vendly.com>',
        //         to: req.body.email,
        //         subject: "Welcome to Vendly",
        //         html: "Welcome to Vendly"
        //     };
        //
        //     nodemailerMailgun.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             return console.log(error);
        //         }
        //         console.log('Message sent: ' + info.response);
        //     });
        //
        //     res.json(req.body.email);
        // }
    },

    sendNewUserInviteEmail: function(req, res) {
        // if (!req.payload._id) {
        //     res.status(401).json({
        //         "message": "UnauthorizedError: private profile"
        //     });
        // } else {
        //
        //     var options = {
        //         viewEngine: {
        //             extname: '.hbs',
        //             layoutsDir: 'views/email/',
        //             defaultLayout: 'welcome_email'
        //         },
        //         viewPath: 'views/email/',
        //         extName: '.hbs'
        //     };
        //     nodemailerMailgun.use('compile', hbs(options));
        //
        //     var mailOptions = {
        //         from: 'Vendly <info@vendly.com>',
        //         to: req.body.email,
        //         subject: "Welcome to Vendly!",
        //         template: 'welcome_email',
        //         context: {
        //             firstname: req.body.firstname
        //         }
        //     };
        //
        //     nodemailerMailgun.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             return console.log(error);
        //         }
        //         console.log('Message sent: ' + JSON.stringify(info));
        //     });
        //
        //     res.json(req.body.email);
        // }
    }
};