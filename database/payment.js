const mongoose =require("mongoose");


 
const paymentmainSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: false,
        default: "Default Type"
    },
    amount :{
        type:String,
        required:true,
        unique: false,
        default: "Default Type"
    },
    type :{
        type:String,
        required:true,
        unique: false,
        default: "Default Type"
        
    },
    transactionId:{
        type:String,
        required:true,
        unique: false,
        default: "Default Transaction ID"
    },
    date: {
        type : String,
        required:true,
        unique: false,
        default: "Default Type"
    },
    products:[
        {
            name:{
                type:String,
                required:true,
                unique: false,
                default: "Default Type"
            },
            price :{
                type:Number,
                required:true,
                unique: false,
                default: 0
            },
            offer_price :{
                type:Number,
                required:true,
                unique: false,
                default: 0
                
            },
            discount :{
                type:Number,
                required:true,
                unique: false,
                default: 0
                
            },
            imageUrls: {
                type: [String],
                default: [] // Example default value for the 'imageUrls' field in 'products'
            },
            quantity: {
                type: Number,
                required: false,
                default: 0
                
              }
            
          
        }
            
    ]
    
})
const paymentSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Login', // Reference to the User model (adjust as needed)
    },


    payments: {
        type: [paymentmainSchema], // An array of paymentmainSchema items
        default: [] // Default value of an empty array
      } // An array of cart items
  });

  paymentSchema.index({ transactionId: 1 }, { unique: false });

  
const payment = new mongoose.model("payment",paymentSchema);

module.exports = payment