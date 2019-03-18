var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');
var User = require("../../models/User");

router.post('/password/reset', function(req, res){
	var email = req.body.email;
	var randPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
	var newPassword = randPassword;
  
   bcrypt.genSalt(10, (err, salt)=>{
	bcrypt.hash(randPassword, salt, (err, hash)=>{
		if(err) throw err;
		User.findOneAndUpdate({email}, {$set: { password: hash }}, {upsert: true}, function(err){
		  if (err) return res.send(500, { error: err });
		   var transporter = nodemailer.createTransport({
			 service: 'gmail',
			 auth: {
			   user: 'dinnhall123@gmail.com',
			   pass: 'asddsa123'
			 }
		   });
		   
		   var mailOptions = {
			 from: 'dinnhall123@gmail.com',
			 to: email,
			 subject: 'Your new password',
			 html: '<html><body><p>Hello! We would inform you that you new password is: <b>'+newPassword+'</b><br> You can change it in your profile</p></body></html>'
		   };
		   
		   transporter.sendMail(mailOptions, function(error, info){
			 if (error) {
			   console.log(error);
			 } else {
			   console.log('Email sent: ' + info.response);
			 }
		   });  
		   // res.send("succesfully saved");
			res.redirect('/user/signin');
		 })
		 
	 })
 });
   
 });

 router.get('/email/verify', function(req, res){
		var email = req.query.email;
		User.findOneAndUpdate({email}, {$set: { isEnabled: true }}, {upsert: true}, function(err){
				res.redirect("/user/signin");
		});

 });
 module.exports = router;