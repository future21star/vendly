var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

var Vacation = require('../models/vacation.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    var context = {
       
    }
    res.render('index', context);
});

router.get('/vacations', function(req, res){
    Vacation.find({ available: true }, function(err, vacations){
    	var currency = 'USD';
        var context = {
            currency: currency,
            vacations: vacations.map(function(vacation){
                return {
                    sku: vacation.sku,
                    name: vacation.name,
                    description: vacation.description,
                    inSeason: vacation.inSeason,
                    price: vacation.priceInCents/100,
                    qty: vacation.qty,
                };
            })
        };
        switch(currency){
	    	case 'USD': context.currencyUSD = 'selected'; break;
	        case 'GBP': context.currencyGBP = 'selected'; break;
	        case 'BTC': context.currencyBTC = 'selected'; break;
	    }
        res.render('vacations', context);
    });
});

module.exports = router;
