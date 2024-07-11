
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

// Define a schema for the user's cart
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Login', // Reference to the User model (adjust as needed)
  },
  items: [cartItemSchema], // An array of cart items
});

// Create a Cart model using the schema
const CartItem = mongoose.model('cartSchema', cartSchema);

module.exports = CartItem;