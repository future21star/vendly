var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET', // TODO - put this in a config file
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var amazons3 = require('../controllers/amazons3');
var files = require('../controllers/files');
var handbook = require('../controllers/handbook');

// file upload
router.get('/sign', auth, amazons3.getSignedURL);
router.get('/getImage', auth, amazons3.getImage);
router.post('/saveFile', auth, files.saveFile);

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.put('/updateProfile', auth, ctrlProfile.updateProfile);

// rolodex contacts
router.get('/rolodex', auth, ctrlProfile.rolodexRead);
router.post('/saveContact', auth, ctrlProfile.saveContact);

// calendar
router.get('/calendar', auth, ctrlProfile.calendarRead);
router.post('/saveEvent', auth, ctrlProfile.saveEvent);
router.put('/updateEvent', auth, ctrlProfile.updateEvent);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// booklet
router.get('/booklets', auth, handbook.bookletRead);
router.post('/saveBooklet', auth, handbook.saveBooklet);
router.put('/updateBooklet', auth, handbook.updateBooklet);
router.put('/setActiveHandbook', auth, handbook.setActiveHandbook);
router.get('/getActiveHandbook', auth, handbook.getActiveHandbook);

// email
router.post('/sendEmail', auth, ctrlProfile.sendEmail);
router.post('/sendNewUserInviteEmail', auth, ctrlProfile.sendNewUserInviteEmail);

module.exports = router;
