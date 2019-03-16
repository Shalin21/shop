var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');
var User = require("../models/User");
var Cart = require("../models/Cart");


router.get("/category/:cat/", function(req, res, next) {
	var _         = require("underscore");
	var mdbClient = require('mongodb').MongoClient;
	var cat = req.params.cat;
	
	
	mdbClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, (err, client) => {
		var db = client.db('shop');
		var collection = db.collection('categories');
		
		collection.find({ name: cat }).toArray(function(err, items) {
			res.render("category", { 
				// Underscore.js lib
				_     : _, 
				
				// Template data
				title : "Shopifyzed",
				items : items,
				active : cat,
			});

			client.close();
		});
	});
});


router.get("/category/:cat/:subcat/", function(req, res, next) {
	var _         = require("underscore");
	var mdbClient = require('mongodb').MongoClient;
	var fs = require("fs");

	var cat = req.params.cat;
	var subcat = req.params.subcat;
	var reg_var = (cat+"-"+subcat).toLowerCase();
	

	var reg_ex = new RegExp('\\b'+reg_var);
	
	mdbClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, (err, client) => {
		var db = client.db('shop');
		var collection = db.collection('products');
		
		collection.aggregate([
			{$match: { primary_category_id: {$regex:reg_ex }} },
			{$group : {_id:"$primary_category_id"} }
		]).toArray(function(err, items) {
			var categories = items.map(function(item, index){	
				
				
				var image = null;
				// console.log(item._id);
				
				if (fs.existsSync(`public/images/categories/${item._id}.png`)) {
					image = `public/images/categories/${item._id}.png`;
				}

				if(!item._id.includes("accessories")){
					return {id: item._id, name: item._id.replace(/-/g, ' ').slice(item._id.search('clothing')+"clothing".length).trim(), image: image};
				}
					return {id: item._id, name: item._id.slice(item._id.lastIndexOf("-")+1), image: image};								
			})			
			res.render("subcategory", { 
				// Underscore.js lib
				_     : _, 				
				// Template data
				title : "Shopifyzed",
				items : categories,
				subcat: subcat,
				active : cat,
			});

			client.close();
		});
	});
});

router.get("/category/:cat/:subcat/:product/", function(req, res, next) {
	var _         = require("underscore");
	var mdbClient = require('mongodb').MongoClient;

	var cat = req.params.cat;
	var subcat = req.params.subcat;
	var product = req.params.product;
	mdbClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, (err, client) => {
		var db = client.db('shop');
		var collection = db.collection('products');
		
		collection.find({primary_category_id: product}).toArray(function(err, items) {
			
			res.render("productsList", { 
				// Underscore.js lib
				_     : _, 
				
				// Template data
				title : "Shopifyzed",				
				items : items,
				subcat: subcat,
				product: product.replace(/-/g, ' ').slice(product.search('clothing')+"clothing".length).trim(),
				active : cat,
			});

			client.close();
		});
	});
});

router.get("/product/:id/", function(req, res, next) {
	var _         = require("underscore");
	var mdbClient = require('mongodb').MongoClient;
	var id = req.params.id;
	var viewed = req.session.viewed || [];
	var newItem = {};
	
	
	mdbClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, (err, client) => {
		var db = client.db('shop');
		var collection = db.collection('products');	
		collection.findOne({id: id}, (function(err, item) {	
			newItem = {id, name:item.name};
			let hasItem = viewed.some( view => view.id === id );
			
			if(!hasItem){
				if(viewed.length >=3){
					viewed.shift();
					viewed.push(newItem);
					req.session.viewed = viewed;
				}
				else{
					viewed.push(newItem);
					req.session.viewed = viewed;
				}
			}		
			res.render("product", { 
				// Underscore.js lib
				_     : _, 				
				// Template data
				title : "Shopifyzed",
				item : item,
				subcat: item.primary_category_id.split('-')[1],
				gender : item.primary_category_id.split('-')[0],
				norm_type : item.primary_category_id,
				type: item.primary_category_id.replace(/-/g, ' ').slice(item.primary_category_id.search('clothing')+"clothing".length).trim(),
				product: item.name,
			});
			client.close();
		}));
	});
});

router.get("/", function(req, res, next) {
	req.session.errors = null;
	var _         = require("underscore");
	var mdbClient = require('mongodb').MongoClient;
	
	var newCart = new Cart(req.session.cart ? req.session.cart : {});
	req.session.cart = newCart;
	mdbClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, (err, client) => {
		var db = client.db('shop');
		var collection = db.collection('categories');
		
		collection.find().toArray(function(err, items) {
			res.render("index", { 
				// Underscore.js lib
				_     : _, 
				
				// Template data
				title : "Shopifyzed",
				items : items
			});

			client.close();
		});
	});
});

router.post('/password/reset', function(req, res){
	var email = req.body.email;
	var randPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
	var newPassword = randPassword;
 
   bcrypt.genSalt(10, (err, salt)=>{
	bcrypt.hash(randPassword, salt, (err, hash)=>{
		if(err) throw err;
		User.findOneAndUpdate({email}, {$set: { password: hash }}, {upsert: true}, function(err){
		  if (err) return res.send(500, { error: err });
		   var transporter = nodemailer.createTransport({
			 service: 'gmail',
			 auth: {
			   user: 'dinnhall123@gmail.com',
			   pass: 'asddsa123'
			 }
		   });
		   
		   var mailOptions = {
			 from: 'dinnhall123@gmail.com',
			 to: email,
			 subject: 'You added item to wishlist',
			 text: 'Hello! We would inform you that you new password is: '+newPassword+' you can change it in your profile'
		   };
		   
		   transporter.sendMail(mailOptions, function(error, info){
			 if (error) {
			   console.log(error);
			 } else {
			   console.log('Email sent: ' + info.response);
			 }
		   });  
		   return res.send("succesfully saved");
			res.send('/user/signin');
		 })
		 
	 })
 });
   
 });


module.exports = router;