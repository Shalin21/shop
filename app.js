// Module dependencies.
var express = require("express")
  , http    = require("http")
  , path    = require("path")
  , routes  = require("./routes")
  , search = require("./modules/search/search");
var app     = express();

// All environments
app.set("port", 80);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.favicon());
app.use(express.static('public'));
app.use(express.logger("dev"));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser("61d333a8-6325-4506-96e7-a180035cc26f"));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.errorHandler());

// App routes
app.get("/"     , routes.index);
app.get("/category/:cat/", routes.category);
app.get("/category/:cat/:subcat/", routes.subcategory);
app.get("/category/:cat/:subcat/:product/", routes.productsList);
app.get("/product/:id/", routes.product);
app.post('/search', search.search);

// Run server
http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening on port " + app.get("port"));
});