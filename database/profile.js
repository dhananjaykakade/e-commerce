// profileSchema.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Login', // Reference to the Login model
    required: true
  },
  address: String,
  contactNumber: String,
  
});

module.exports = mongoose.model('Profile', profileSchema);
