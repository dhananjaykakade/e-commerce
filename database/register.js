const mongoose =require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
const loginSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true,
        unique:true
    },
    password :{
        type:String,
        required:true
        
    },
    userRole: {
        type: String,
        default: "User", 
    },
    address: {
        type: String,
        default: "none", 
        
    },
    contactNumber: {
        type: String,
        default: "none", 
        
    },
    originalPassword: {
        type: String // Store the original password here
    }
})

loginSchema.pre('save', function (next) {
    const user = this;
  
    if (!user.isModified('password')) return next();
  
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);
  
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
  
        user.password = hash;
        next();
      });
    });
  });


  loginSchema.plugin(passportLocalMongoose, {
    usernameField: 'username', // Specify the field you want to use for username
    
  });
const Login = new mongoose.model("Login",loginSchema);
module.exports=Login;