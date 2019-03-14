var passport = require("passport");
const bcrypt = require("bcryptjs");
var User = require("../models/User");
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
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                if(err) throw err;
                newUser.password = hash;
                newUser.save(function(err, result){
                    if(err) return done(err);
                    req.session.errors = null;
                    return done(null, newUser);
                })
            })
        });             
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback: true           // added to get field from form
        
}, function(req, email, password, done){
    console.log("Doshli");
    User.findOne({'email':email}, function(err, user){
        if(err) {
            console.log(err);           
            return done(err);
        }
             
        if(!user) {
            console.log("Email is not registered");
            req.session.errors = null;
            req.session.errors = "Email is not registered";
            return done(null, false);
        }     
        bcrypt.compare(password, user.password, function(err, res) {          
            if(err) {
                console.log("Wrong password");
                req.session.errors = null;
                req.session.errors = "Wrong password";
                return done(null, false);
            }
            req.session.errors = null;
            var protectedUser = user;
            protectedUser.password = "this_is_not_real_password";
            req.session.user = protectedUser;
            return done(null, user);          
        });        
    });
}));