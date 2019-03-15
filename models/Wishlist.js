const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//Create Schema
const WishlistSchema = new Schema({
    user :{
        type: String,
        required: true,
    },
    items:[
        {product: { type: String}}
    ],   
});

module.exports = Wishlist = mongoose.model('Wishlist', WishlistSchema);

