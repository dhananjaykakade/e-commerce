const mongoose =require("mongoose");
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: false
    },
    details :{
        type:String,
        required:true,
        unique: false
    },
    price :{
        type:Number,
        required:true,
        unique: false
        
    },
    offer_price :{
        type:Number,
        required:true,
        unique: false
        
    },
    discount :{
        type:Number,
        required:true,
        unique: false
        
    },
    imageUrls: [String],
    category :{
        type:String,
        required:true
        
    }
})



  
const Product = new mongoose.model("Product",productSchema);

module.exports = Product