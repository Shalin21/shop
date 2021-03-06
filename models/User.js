const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//Create Schema
const UserSchema = new Schema({
    name :{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    isEnabled:{
        type: Boolean,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
});

module.exports = User = mongoose.model('user', UserSchema);