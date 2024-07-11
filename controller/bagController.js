const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const Product = require("../database/product");
const CartItem = require("../database/cart");

exports.postBag = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!req.isAuthenticated()) {
      const SessionQuantity = parseInt(quantity, 10);

      const cart = req.session.cart || [];

      // Check if the product is already in the cart
      const existingProductIndex = cart.findIndex(
        (item) => item.productId === productId
      );

      if (existingProductIndex !== -1) {
        // If the product is already in the cart, increment its quantity
        cart[existingProductIndex].SessionQuantity++;
      } else {
        // If the product is not in the cart, add it with a SessionQuantity of 1
        cart.push({ productId, SessionQuantity: 1 });
      }

      // Save the updated cart back to the session
      req.session.cart = cart;
      global.SessionCart = cart;

      console.log(global.SessionCart);

      console.log(cart);

      return res.redirect("/bag");
    } else {
      // Find the user's cart
      const userCart = await CartItem.findOne({ user: req.user._id });

      // If the user doesn't have a cart, create one
      if (!userCart) {
        const newCart = new CartItem({ user: req.user._id, items: [] });
        await newCart.save();
      } 
      const parsedQuantity = parseInt(quantity, 10);

      if (userCart.items.length === 0) {
        userCart.items.push({ product: productId, quantity });
      }else {


      const existingCartItemIndex = userCart.items.findIndex(
        (item) => item.product == productId
      );

      if (existingCartItemIndex !== -1) {
        
        // Increment the quantity
        userCart.items[existingCartItemIndex].quantity += parsedQuantity;
      } else {
        // Add the item to the user's cart
        userCart.items.push({ product: productId, quantity });
      }
    }
      await userCart.save();
      

      res.redirect("/bag");

      if (req.user._id == null) {
        console.log("user not found");
      }
    }
  } catch (err) {
    console.error(err);

    res.redirect("/product");
  }
};

function calculateTotal(items) {
  const deliveryFee = 250;
  
  const total = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return total + deliveryFee;
}

exports.postBagQuantity = async (req, res) => {
  try {
    const { itemId, newQuantity } = req.body;
    
    const user = req.user;
    if (user) {
      
      const userCart = await CartItem.findOne({ user })

    if (!userCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the item with the specified ID
    const itemToUpdate = userCart.items.find(
      (item) => item._id.toString() === itemId
    );

    if (itemToUpdate) {
      // Update the quantity
      itemToUpdate.quantity = newQuantity;

      await userCart.save();

      // Add the delivery charge to the total price
      const updatedTotal = calculateTotal(userCart.items);

      // Send the updated subtotal and new total price to the client

      return res
        .status(200)
        .json({ message: "Quantity updated", updatedTotal });
    } else {
      return res.status(404).json({ error: "Item not found in the cart" });
    }
    } else {
      const userCart = req.session.cart
      

      if (!userCart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const itemToUpdate = userCart.findIndex(
        (item) => item.productId === itemId
      );

      console.log(userCart[itemToUpdate])

      if (userCart[itemToUpdate]) {
        // Update the quantity
        userCart[itemToUpdate].SessionQuantity = parseInt(newQuantity,10)

        req.session.cart= userCart


        
        return res
        .status(200)
        .json({ message: "Quantity updated"  });

      }


    }
    
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item quantity" });
  }
};

function SessionCalculateTotal(items) {
  
  const deliveryFee = 250;
  
  const total = items.reduce((sum, item) => {
    return sum + item.product.price * item.SessionQuantity;
  }, 0);

  return total + deliveryFee;
}
function SessionCalculateSubTotal(items) {
  return items.reduce((total, item) => {
    return total + item.product.price * item.SessionQuantity;
  }, 0);
}

exports.getBag = async (req, res) => {
  try {
    const isAuthenticated = req.isAuthenticated();
    const user = req.user;
    
    if (!user) {
      // For unauthenticated users, retrieve cart items from session
      const cart = req.session.cart || [];
      const productIds = cart.map(item => item.productId);
      
      // Query database to fetch product details based on product IDs
      const products = await Product.find({ _id: { $in: productIds } }).exec();
      
      // Combine product details with quantities from the cart
      const cartItems = cart.map(item => {
        const product = products.find(product => product._id.toString() === item.productId);
        return { ...item, product: product, quantity: item.quantity };
      });
      
      res.render("product/bagmain", {
        cart: null,
        cartItem: cartItems,
        deliveryCharge: 250,
        SessionCalculateSubTotal,
        SessionCalculateTotal,
        notLogged: true,
        isAuthenticated,
        isEmpty: false,
      });
    } else {
      // For authenticated users, retrieve cart items from database
      const userCart = await CartItem.findOne({ user: req.user._id }).populate("items.product");
      console.log(userCart);
      
      if (!userCart || userCart.items.length === 0) {
        res.render("product/bagmain", {
          cart: null,
          cartItem: null,
          deliveryCharge: 250,
          total: 0,
          
          product_total: 0,
          calculateTotal,
          notLogged: false,
          isEmpty: true,
          isAuthenticated,
          user,
        });
        return;
      }
      function  total (items) {
        return items.reduce((acc, item) => {
          return acc + item.product.price * item.quantity;
        }, 0);
      };
      res.render("product/bagmain", {
        cart: userCart,
        cartItem: null,
         total, 
        
        product_total: total,
        calculateTotal,
        notLogged: false,
        isEmpty: false,
        user,
        isAuthenticated,
        UserActivation: true,
      });
    }
  } catch (err) {
   console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.postRemove = async (req, res) => {
  try {
    const { itemId } = req.body;
    

    let userCart;

    // Check if the user is authenticated
    if (req.user) {
      // If authenticated, find the user's cart in the database
      userCart = await CartItem.findOne({ user: req.user._id });

      if (!userCart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      userCart.items = userCart.items.filter(
        (item) => item._id.toString() !== itemId
      );
    } else {
      
      // If not authenticated, retrieve the cart from the session
      userCart = req.session.cart;

      console.log(userCart);
      
      if (!userCart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      
      // Filter out the item with matching itemId
      userCart = userCart.filter((item) => item.productId !== itemId);
      
      
      
      // Update the session cart with the filtered cart
      req.session.cart = userCart;
      
     return res.status(200).json({ message: "Item removed from the cart" });
    }


    if (req.user) {
      
      await userCart.save();
      const updatedTotal = calculateTotal(userCart.items);
      res
      .status(200)
      .json({ message: "Item removed from the cart", updatedTotal });
    } else {
      
      req.session.cart = userCart;
      res
      .status(200)
      .json({ message: "Item removed from the cart", updatedTotal });
    }
    
    

 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove item from the cart" });
  }
};

exports.postClear= async (req,res) => {
  try {
    const user = req.user;

    if (!user) {
      console.log("user not found");

      return false;
    }
    await CartItem.findOneAndDelete({ user: req.user._id });

    delete req.session.transactionId;
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}