var nodemailer = require('nodemailer');



var sendVerify = function(email){
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
        subject: 'Verify your email',
        html: '<html><body><p>Hello! To verify your email please go to this link: http://localhost:80/update/email/verify?email='+email+'</p></body></html>',
        text: 'Please confirm your account by clicking the following link: http://localhost:80/update/email/verify?email='+email
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });  
}

module.exports.sendVerify = sendVerify; 