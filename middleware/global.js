const Login = require("../database/register");
const CartItem = require("../database/cart");

global.SessionCart ={}

const copy = async (req, res, next) => {
  try {
    const username = req.body.username;
    const user = await Login.findOne({ username: username });
    if (!user) {
      console.log("User not found");
      return res.status(401).send("User not found");
    }

    const userCart = await CartItem.findOne({
      user: user._id,
    });

    if (!userCart) {
      const newCart = new CartItem({
        user: req.user._id,
        items: [],
      });
      await newCart.save();
    }
    const sessionCart = global.SessionCart;
    if (!sessionCart) {
      return false;
    }
    if ( sessionCart.length > 0) {
      const mapData = sessionCart.map((item) => ({
        productId: item.productId,
        quantity: parseInt(item.SessionQuantity, 10),
      }));
      console.log(mapData);
      mapData.forEach((item) => {
        const existingCartItemIndex = userCart.items.findIndex((cartItem) =>
          cartItem.product.equals(item.productId)
        );

        if (existingCartItemIndex !== -1) {
          userCart.items[existingCartItemIndex].quantity += item.quantity;
        } else {
          userCart.items.push({
            product: item.productId,
            quantity: item.quantity,
          });
        }
      });

      await userCart.save();
    }

    next(); // Don't forget to call next() to pass control to the next middleware or route handler
  } catch (error) {
    console.log(error);
    next(error); // Pass error to Express error handling middleware
  }
};

module.exports = copy;
