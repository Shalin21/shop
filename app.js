// Module dependencies.
var express = require("express")
  , http    = require("http")
  , path    = require("path")
  , routes  = require("./routes")
  , auth  = require("./modules/auth/auth")
  , cart  = require("./modules/cart/cart")
  , signin  = require("./modules/auth/signin")
  , search = require("./modules/search/search");
var app     = express();
var mongoose = require("mongoose");
var config = require('config');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

const stripe = require("stripe")("sk_test_z3sNfj3NnqFjZRr4ObckHb2z");
const bodyParser = require("body-parser");
//Mongo connection
mongoose
  .connect(config.get("mongoUrl"))
  .then(()=>{console.log("MongoDB connected...")})
  .catch(error=>{console.log(error);})


// All environments
app.set("port", 80);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.favicon());
app.use(express.static('public'));
app.use(express.logger("dev"));
app.use(express.bodyParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.methodOverride());
app.use(express.cookieParser("61d333a8-6325-4506-96e7-a180035cc26f"));
// app.use(express.session());
app.use(session({
  secret: config.get("sessionSecret"),
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 60 * 12 * 60 * 1000}
}))
var appendLocalsToUseInViews = function(req, res, next)
{            
    //append request and session to use directly in views and avoid passing around needless stuff
    res.locals.session = req.session;
    next(null, req, res);
}
app.use(appendLocalsToUseInViews);
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
app.post('/user/singup', auth.auth);
app.post('/user/singin', signin.signin);
app.get('/cart', cart.get);
app.get('/cart/add/:id', cart.add);
app.get('/cart/remove/:id', cart.remove);
app.post("/charge", cart.charge);
// Run server
http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening on port " + app.get("port"));
});
