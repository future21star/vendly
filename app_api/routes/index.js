var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var amazons3 = require('../controllers/amazons3');
var files = require('../controllers/files');
var handbook = require('../controllers/handbook');
var emails = require('../controllers/emails');
var employee = require('../controllers/employee');

// files
router.get('/sign', auth, amazons3.getSignedURL);
router.get('/getFilePath', auth, amazons3.getFilePath);
router.post('/saveFile', auth, files.saveFile);
router.get('/getFiles', auth, files.getFiles);

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.put('/updateProfile', auth, ctrlProfile.updateProfile);

// rolodex contacts
router.get('/rolodex', auth, ctrlProfile.rolodexRead);
router.post('/saveContact', auth, ctrlProfile.saveContact);
router.put('/updateContact', auth, ctrlProfile.updateContact);

// calendar
router.get('/calendar', auth, ctrlProfile.calendarRead);
router.post('/saveEvent', auth, ctrlProfile.saveEvent);
router.put('/updateEvent', auth, ctrlProfile.updateEvent);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.put('/changePassword', ctrlAuth.changePassword);

// booklet
router.get('/booklets', auth, handbook.bookletRead);
router.post('/saveBooklet', auth, handbook.saveBooklet);
router.put('/updateBooklet', auth, handbook.updateBooklet);
router.put('/setActiveHandbook', auth, handbook.setActiveHandbook);
router.get('/getActiveHandbook', auth, handbook.getActiveHandbook);

// email
router.post('/sendEmail', auth, emails.sendEmail);
router.post('/sendNewUserInviteEmail', auth, emails.sendNewUserInviteEmail);
router.post('/signUpUser', auth, emails.signUpUser);

// employee
router.post('/saveEmployee', auth, employee.saveEmployee);
router.get('/getEmployees', auth, employee.getEmployees);

module.exports = router;