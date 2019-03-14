var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var passport = require("passport");


router.use(csrf());


router.get('/signin', function(req, res, next){
      res.render("user/login", { 
        title : "Shopifyzed",
        csrfToken: req.csrfToken()
    });
    });

router.get('/profile', isLoggedIn, function(req, res, next){
      res.render("user/profile", { 
        title : "Shopifyzed",
        csrfToken: req.csrfToken()
    });
    });

router.get('/signup', function(req, res, next){
      res.render("user/signup", { 
        title : "Shopifyzed",
        csrfToken: req.csrfToken()
    });
    });
    
router.post('/signup', passport.authenticate('local.signup',{
      successRedirect : '/user/signin',
      failureRedirect: '/user/signup',
    }));
    
router.post('/signin', passport.authenticate('local.signin',{
      successRedirect : '/',
      failureRedirect: '/user/signin',
    }));

    module.exports = router;

    function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
        return next();
      }
      res.redirect('/user/signin');
    };