var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// rolodex contacts
router.get('/rolodex', auth, ctrlProfile.rolodexRead);
router.post('/saveContact', auth, ctrlProfile.saveContact);

// calendar
router.get('/calendar', auth, ctrlProfile.calendarRead);
router.post('/saveEvent', auth, ctrlProfile.saveEvent);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// booklet
router.get('/booklets', auth, ctrlProfile.bookletRead);
router.post('/saveBooklet', auth, ctrlProfile.saveBooklet);

module.exports = router;
