var express = require('express');
var router = express.Router();

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
	
	
	
	mdbClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, (err, client) => {
		var db = client.db('shop');
		var collection = db.collection('products');	
		collection.findOne({id: id}, (function(err, item) {	
			if(!viewed.includes(id)){
				if(viewed.length >=3){
					viewed.shift();
					viewed.push({id, name:item.name});
					req.session.viewed = viewed;
				}
				else{
					viewed.push({id, name:item.name});
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

module.exports = router;