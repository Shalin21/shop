const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('config');

const User = require("../../models/User");


exports.auth = function(req, res) {
    const {name, email, password} = req.body;
    

    //validation
    if(!name || !email || !password) {
        return res.status(400).json({msg: "Please provide all fields"});
    }

    //check if exist

    User.findOne({email})
        .then(user =>{
            if(user) return res.status(400).json({msg: "User already exists"});

            const newUser = new User({
                name,
                email,
                password
            });
            
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user =>{

                            jwt.sign(
                                {id: user.id},
                                config.get("jwtSecret"),
                                {expiresIn: 7200},
                                (err, token)=>{
                                    if(err) throw err;

                                    res.json({
                                        token,
                                        user: {
                                            id: user.id,
                                            name: user.name,
                                            email: user.email
                                        }
                                    })
                                }
                            )

                            
                        })
                })
            });

        })

};