var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET', // TODO move to env variable
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

/* GET home page. */
router.get('/', function(req, res, next) {
    var context = {
       
    }
    res.render('index', context);
});

module.exports = router;

//var Vacation = require('../models/vacation.js');
//
//
//
//router.get('/vacations', function(req, res){
//    Vacation.find({ available: true }, function(err, vacations){
//    	var currency = 'USD';
//        var context = {
//            currency: currency,
//            vacations: vacations.map(function(vacation){
//                return {
//                    sku: vacation.sku,
//                    name: vacation.name,
//                    description: vacation.description,
//                    inSeason: vacation.inSeason,
//                    price: vacation.priceInCents/100,
//                    qty: vacation.qty,
//                };
//            })
//        };
//        switch(currency){
//	    	case 'USD': context.currencyUSD = 'selected'; break;
//	        case 'GBP': context.currencyGBP = 'selected'; break;
//	        case 'BTC': context.currencyBTC = 'selected'; break;
//	    }
//        res.render('vacations', context);
//    });
//});