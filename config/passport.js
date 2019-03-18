var passport = require("passport");
const bcrypt = require("bcryptjs");
var User = require("../models/User");
var Wishlist = require("../models/Wishlist");
var LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var emailService = require("../modules/email/email");

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err,user);
    })
});

passport.use('local.signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback: true           // added to get field from form
        
}, function(req, email, password, done){
    User.findOne({'email':email}, function(err, user){
        if(err) return done(err);
        
        if(password != req.body.repeat_password){
            req.session.errors = null;
            req.session.errors = "Passwords dont match";
            return done(null, false);
        }
        if(user) {
            req.session.errors = null;
            req.session.errors = "Email is already is use";
            return done(null, false);
        }
        var newUser = new User({
            name: req.body.name,
            email,
            isEnabled: false,
            password
        });
        var newWishlist = new Wishlist({
            user: newUser.email,
            items:[]
        });
        newWishlist.save();
            bcrypt.hash(newUser.password, 10, (err, hash)=>{
                if(err) throw err;             
                newUser.password = hash;
                newUser.save(function(err, result){
                    if(err) return done(err);
                    req.session.errors = null;   
                    emailService.sendVerify(newUser.email);                   
                    req.session.userEmail = newUser.email;
                    return done(null, newUser);
                })
                
            })
                    
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback: true           // added to get field from form
        
}, function(req, email, password, done){
    User.findOne({'email':email}, function(err, user){
        if(err) {          
            return done(err);
        }
             
        if(!user) {

            req.session.errors = null;
            req.session.errors = "Email is not registered";
            return done(null, false);
        }   
          
        
            bcrypt.compare(password, user.password, function(err, res) {  
                        
                if(err) {
                    req.session.errors = null;
                    req.session.errors = "Wrong password";
                    return done(null, false);
                }
                if(res){
                    req.session.errors = null;           
                    req.session.userEmail = user.email;
                    return done(null, user); 
                }
                else{
                    req.session.errors = null;
                    req.session.errors = "Wrong password";
                    return done(null, false);
                }
                         
            }); 
               
    });
}));

passport.use(new GoogleStrategy({
    clientID: '604983081709-8a8ut73b2glbo7hv5qvl2tmbn517s3j9.apps.googleusercontent.com',
    clientSecret: 'HT5Z6eoRlR-Z0sGW0EVChZVA',
    callbackURL: "http://localhost:80/user/auth/google/callback",
     passReqToCallback : true,
  },
  function(req, accessToken, refreshToken, profile, done) {     
    User.findOne({'email': profile.emails[0].value}, function(err, user) {
      if (err) { return done(err); }
      if(user){
        req.session.userEmail = user.email;
        done(null, user);
      }
      else{
        var randPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        var newUser = new User({
            name: profile.name.givenName+" "+profile.name.familyName,
            email: profile.emails[0].value,
            isEnabled: true,
            password:randPassword
        });
        var newWishlist = new Wishlist({
            user: newUser.email,
            items:[]
        });
        newWishlist.save();
            bcrypt.hash(newUser.password, 10, (err, hash)=>{
                if(err) throw err;          
                newUser.password = hash;
                newUser.save(function(err, result){
                    if(err) return done(err);
                    req.session.errors = null;                      
                    req.session.userEmail = newUser.email;
                    return done(null, newUser);
                })
                
            })
      }
      
    });
  }
));