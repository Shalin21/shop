var express = require('express');
var router = express.Router();

var Cart = require("../../models/Cart");


router.get('/add/:id', function(req, res, next) {
	var mdbClient = require('mongodb').MongoClient;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var productId = req.params.id;
	
	
	mdbClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, (err, client) => {

		var db = client.db('shop');
		var collection = db.collection('products');	
		collection.findOne({ id: productId }, function(err, item) {	    	
           if(err) return res.redirect('..?error=1');

            cart.add(item, item.id);
            req.session.cart = cart;

             res.redirect('/cart');
			client.close();
		});
	});
});


router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');

});


router.get('/', function(req, res, next) {
  var _         = require("underscore");
  res.render("cart", { 
      // Underscore.js lib
      _     : _, 
      
      // Template data
      title : "Shopifyzed",				     
  });
});


router.post("/charge", function(req, res, next) {
    var config = require('config');
    var stripe = require('stripe')(config.get("keySecret"));
    let amount = req.session.cart.totalPrice * 100;


    stripe.customers.create({
      email: req.body.email,
      card: req.body.id
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "Sample Charge",
        currency: "usd",
        customer: customer.id
      }))
    .then(charge => res.send(charge))
    .catch(err => {
      //console.log("Error:", err);
      res.status(500).send({error: "Purchase Failed"});
    });
});

module.exports = router;