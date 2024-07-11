
const Product = require("../database/product");

exports.getProducts = async (req, res) => {
    try {
        const isAuthenticated = req.isAuthenticated();
        const user = req.user;
        const products = await Product.find().sort({ category: 1, name: 1 });
        const categories = [
          ...new Set(products.map((product) => product.category)),
        ].map((category) => ({ name: category }));
        res.render("product/shop", { products, categories, isAuthenticated, user });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching products");
      }
}



exports.getProduct  = async (req,res) => {
    try {
        const isAuthenticated = req.isAuthenticated();
        const user = req.user;
        const productId = req.params.id;
        const product = await Product.findById(productId);
        res.render("product/product", { product, isAuthenticated, user });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching product details");
      }
}

