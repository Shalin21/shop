// Module dependencies.
var express = require("express")
  , http    = require("http")
  , path    = require("path")
  , errorhandler = require('errorhandler')
  , routes  = require("./routes/routes")
  , cart_routes  = require("./routes/cart/routes")
  , wishlist  = require("./routes/wishlist/routes")
  , search = require("./routes/search/routes")
  , auth = require("./routes/auth/routes")
  , update = require("./routes/auth/update")
  , mongoose = require("mongoose")
  , config = require('config')
  , session = require('express-session')
  , MongoStore = require('connect-mongo')(session)
  //, csrf = require('csurf')
  , bodyParser = require("body-parser")
  , cookieParser = require('cookie-parser')
  , stripe = require("stripe")("sk_test_z3sNfj3NnqFjZRr4ObckHb2z")
  , passport = require("passport");
var app     = express();

//Mongo connection
mongoose
  .connect(config.get("mongoUrl"))
  .then(()=>{console.log("MongoDB connected...")})
  .catch(error=>{console.log(error);})

  require("./config/passport");
  var appendLocalsToUseInViews = function(req, res, next)
  {        
    res.locals.session = req.session;    
      next(null, req, res);
  }
// All environments

app.use(cookieParser());
//app.use(express.cookieParser("61d333a8-6325-4506-96e7-a180035cc26f"));
app.set("port", 80);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(errorhandler());
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
  secret: config.get("sessionSecret"),
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 60 * 12 * 60 * 1000}
}))

//app.use(csrf());
app.use(appendLocalsToUseInViews);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));




// App routes
app.use("/cart", cart_routes);
app.use("/wishlist", wishlist);
app.use("/search", search);
app.use("/update", update);
app.use("/user", auth);
app.use("/", routes);


// Run server
http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening on port " + app.get("port"));
});
