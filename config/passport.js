var passport = require("passport");
const bcrypt = require("bcryptjs");
var User = require("../models/User");
var Wishlist = require("../models/Wishlist");
var LocalStrategy = require("passport-local").Strategy;

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
            password
        });
        var newWishlist = new Wishlist({
            user: newUser.email,
            items:[]
        });
        newWishlist.save();
            bcrypt.hash(newUser.password, 10, (err, hash)=>{
                if(err) throw err;
                console.log(hash);              
                newUser.password = hash;
                newUser.save(function(err, result){
                    if(err) return done(err);
                    req.session.errors = null;                      
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
        //console.log(user);
        if(err) {
            //console.log(err);           
            return done(err);
        }
             
        if(!user) {
           // console.log("Email is not registered");
            req.session.errors = null;
            req.session.errors = "Email is not registered";
            return done(null, false);
        }     
       // console.log(user.password);
        
        bcrypt.compare(password, user.password, function(err, res) {  
            //console.log();
                    
            if(err) {
               // console.log("Wrong password");
                req.session.errors = null;
                req.session.errors = "Wrong password";
                return done(null, false);
            }
            if(res){
                req.session.errors = null;
                var protectedUser = user;
                protectedUser.password = "this_is_not_real_password";
                req.session.userEmail = user.email;
               // req.session.user = protectedUser;
                return done(null, user); 
            }
            else{
               // console.log("Wrong password");
                req.session.errors = null;
                req.session.errors = "Wrong password";
                return done(null, false);
            }
                     
        });        
    });
}));