var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
var csrf = require("csurf");
var passport = require("passport");
var User = require("../../models/User");
var Wishlist = require("../../models/Wishlist");

router.use(csrf());

router.get('/signin', function(req, res, next){
      res.render("user/login", { 
        title : "Shopifyzed",
        csrfToken: req.csrfToken()
    });
    });

router.get('/profile', isLoggedIn, function(req, res, next){
  var userId = req.session.userEmail;
  User.findOne({email:userId}, function(err, user){
    Wishlist.findOne({user: userId}, function(err, item){
      res.render("user/profile", { 
        title : "Shopifyzed",
        user,
        wishLength: item ? item.items.length : 0,
        csrfToken: req.csrfToken()
      });
    });
  })
  
      
  });

router.get('/signup', function(req, res, next){
      res.render("user/signup", { 
        title : "Shopifyzed",
        csrfToken: req.csrfToken()
    });
    });
    
router.post('/signup', passport.authenticate('local.signup',{
      successRedirect : '/',
      failureRedirect: '/user/signup',
    }));
    
router.post('/signin', passport.authenticate('local.signin',{
      successRedirect : '/',
      failureRedirect: '/user/signin',
    }));
router.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    });
router.get('/auth/google', passport.authenticate('google', {
  scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
  ]
}));

router.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/',
                                      failureRedirect: '/user/signup' }));
router.post('/info/update', function(req, res){
	req.session.errors = null;
	var name = req.body.name;
	var email = req.session.userEmail;
  var password = req.body.password;

  
	if(password != req.body.repeat_password){
		req.session.errors = null;
		req.session.errors = "Passwords dont match";
		res.redirect("/user/profile");
	}
	bcrypt.genSalt(10, (err, salt)=>{
		bcrypt.hash(password, salt, (err, hash)=>{
     
			User.findOneAndUpdate({email}, {$set: { name, password:hash }}, {upsert: true}, function(err, user){     
			res.redirect("/user/profile");
		})		
		})
	})
});

    module.exports = router;

    function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
        return next();
      }
      res.redirect('/user/signin');
    };
