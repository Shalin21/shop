exports.search = function(req, res) {
	var _         = require("underscore");
	var mdbClient = require('mongodb').MongoClient;

	var reg_ex = new RegExp('\\b'+req.body['name']+'\\b');
	
	mdbClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, (err, client) => {
		var db = client.db('shop');
		var collection = db.collection('products');	
		collection.find({ page_title: {$regex: reg_ex}}).toArray(function(err, items) {		
            res.render("search", { 
				// Underscore.js lib
				_     : _, 				
				// Template data
				title : "Shopifyzed",
				items : items,

			});

			client.close();
		});
	});
};