var express = require('express');
var router = express.Router();
var passport = require("passport");
var Wishlist = require("../../models/Wishlist");
var nodemailer = require('nodemailer');

router.get('/add/:id',isLoggedIn, function(req, res, next) {	
    var item_name = req.query.name;
    var productId = req.params.id;
    var userId = req.session.userEmail;
    var itemExists = false;
    Wishlist.findOne({user: { $eq: userId }}, function(err, item){
        itemExists = false;
        item.items.map(function(product, index){
           // console.log(product);           
            if(product.product === productId){
               // console.log("exists");
                itemExists = true;
            }
        })
        if(!itemExists){
            Wishlist.update(
                { user: { $eq: userId } }, 
                { $push: { items: {product: productId} } }, function(err, item){                
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'dinnhall123@gmail.com',
                          pass: 'asddsa123'
                        }
                      });
                      
                      var mailOptions = {
                        from: 'dinnhall123@gmail.com',
                        to: userId,
                        subject: 'You added item to wishlist',
                        text: 'Hello! We would inform you that '+item_name+' was successfuly added to you wishlist. Enjoy your shopping'
                      };
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          //console.log(error);
                        } else {
                          //console.log('Email sent: ' + info.response);
                        }
                      });            
                });
        }
        res.redirect("/wishlist");
    }) 
    
   
    
});


router.get('/remove/:id',isLoggedIn, function(req, res, next) {
    var productId = req.params.id;
    var userId = req.session.userEmail; 
    Wishlist.update(
            { user: userId }, 
            { $pull: { items: {product: productId} } }, function(err, item){
                
                if(err) return res.redirect('..?error=1');           
                res.redirect('/wishlist');               
            });

});


router.get('/', isLoggedIn, function(req, res, next) {
    var _         = require("underscore");
	var mdbClient = require('mongodb').MongoClient;
    var userId = req.session.userEmail; 
	Wishlist.findOne({user: userId}, function(err, item){
        var idArray = [];   
        item.items.map(function(id){idArray.push(id.product)});
	    mdbClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, (err, client) => {
		    var db = client.db('shop');
		    var collection = db.collection('products');
		
		    collection.find({ id: {$in: idArray}}).toArray(function(err, items) {
			    res.render("wishlist/wishlist", { 
				    // Underscore.js lib
				    _     : _, 
				
				    // Template data
				    title : "Shopifyzed",
				    items : items,
			    });

			client.close();
		});
    });
});
});


module.exports = router;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/user/signin');
  };