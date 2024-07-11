const { accessSync } = require("fs");
const CartItem = require("../database/cart");
const payment = require("../database/payment");
const Login = require("../database/register");
const jwt = require("jsonwebtoken");
const secretKey = "dhananjayprashnatkakade";
const puppeteer = require("puppeteer");
const ejs = require("ejs");

function calculateTotal(items) {
  return items.reduce((total, item) => {
    let delivery = 250;
    return total + item.product.price * item.quantity + delivery;
  }, 0);
}

const uuid = require("uuid");

const generateId = () => {
  const transactionId = uuid.v4();
  return transactionId;
};
exports.getCheckOut = async (req, res) => {
  try {
    let id = req.session.transactionId;
    if (!id) {
      // If transaction ID doesn't exist, generate a new one and store it in the session
      id = generateId();
      req.session.transactionId = id;
    }

    const user = req.user;

    if (!user) {
      return false;
    }

    const userCart = await CartItem.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!userCart || userCart.items.length === 0) {
      return false;
    }
    const total = calculateTotal(userCart.items);

    // Find the latest payment for the authenticated user
    const latestPayment = await payment
      .findOne({ user: req.user._id })
      .sort({ "payments.date": -1 })
      .select("payments -_id");

    let paymentNull;

    if (!latestPayment || !latestPayment.payments.length) {

      paymentNull = true;
      // If there are no payments for the user, or if the payments array is empty, send an appropriate response
      return res.render("payment/checkout", {
        user,
        total,
        paymentId: null,
        id,
        paymentNull: true,
      });
    }

    // Get the latest payment from the sorted payments array
    const paymentId = latestPayment.payments[latestPayment.payments.length - 1];

    console.log(paymentId);

    res.render("payment/checkout", { user, total, paymentId, id,paymentNull:false });
  } catch (error) {
    console.error(error);
  }
};

exports.getPayment = async (req, res) => {
  let id = req.session.transactionId;

  const requestedUserId = req.params.id; // Get requested user's ID from URL params

  // Check if the authenticated user is trying to access their own profile}

  try {
    const user = await Login.findById(requestedUserId);

    if (!user) {
      return res.status(401).send("User not found");
    }

    const expiresIn = 330; // 5 minutes and 30 seconds in seconds
    const token = jwt.sign({}, secretKey, { expiresIn });

    const decoded = jwt.decode(token);
    const expirationTime = decoded.exp * 1000;

    // Set the JWT as a secure HttpOnly cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true, // Secure flag ensures cookie is sent over HTTPS only
      sameSite: "strict",
      expires: new Date(expirationTime),
    });

    const userCart = await CartItem.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!userCart || userCart.items.length === 0) {
      return res.status(400).send("User cart not found or empty");
    }

    res.render("payment/payment", {
      user,
      total: calculateTotal(userCart.items),
      id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getUpi = async (req, res) => {
  try {
    let id = req.session.transactionId;

    const requestedUserId = req.params.id; // Get requested user's ID from URL params
    const user = await Login.findById(requestedUserId);
    console.log(requestedUserId);

    if (!user) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }

    const total = req.params.total;
    const userCart = await CartItem.findOne({ user: requestedUserId }).populate(
      "items.product"
    );

    if (!userCart || userCart.items.length === 0) {
      return res.status(400).send("User cart not found or empty");
    }

    res.render("payment/upi", {
      user,
      total,
      cart: calculateTotal(userCart.items),
      id,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getNetBanking = async (req, res) => {
  try {
    let id = req.session.transactionId;
    const requestedUserId = req.params.id; // Get requested user's ID from URL params
    const user = await Login.findById(requestedUserId);
    console.log(requestedUserId);

    if (!user) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }
    const total = req.params.total;
    const userCart = await CartItem.findOne({ user: requestedUserId }).populate(
      "items.product"
    );

    if (!userCart || userCart.items.length === 0) {
      return res.status(400).send("User cart not found or empty");
    }

    res.render("payment/netBanking", {
      user,
      total,
      cart: calculateTotal(userCart.items),
      id,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCard = async (req, res) => {
  try {
    let id = req.session.transactionId;

    const requestedUserId = req.params.id; // Get requested user's ID from URL params
    const user = await Login.findById(requestedUserId);

    if (!user) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }
    const total = req.params.total;
    const userCart = await CartItem.findOne({
      user: requestedUserId,
    }).populate("items.product");

    if (!userCart || userCart.items.length === 0) {
      return res.status(400).send("User cart not found or empty");
    }

    res.render("payment/card", {
      user,
      total,
      cart: calculateTotal(userCart.items),
      id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postPayment = async (req, res) => {
  try {
    const name = req.body.Name;
    const type = req.body.type;
    const date = req.body.date;
    const amount = req.body.amount;
    const transactionId = req.body.transactionId;
    const id = req.body.id;
    console.log(name, type, date, amount, transactionId, id);
    console.log(typeof name)

    // Fetch user's cart items from the database
    const userCart = await CartItem.findOne({ user: id }).populate(
      "items.product"
    );

    // Check if user's cart is empty
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).send("User cart not found or empty");
    }

    // Extract relevant information from user's cart items for payment
    const products = userCart.items.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      offer_price: item.product.offer_price,
      discount: item.product.discount,
      imageUrls: item.product.imageUrls,
      quantity: item.quantity,
    }));
    
    const obj = {
      name,
      type,
      date,
      amount,
      transactionId,
      products,
    }
console.log(obj)
    // Check if the user has previous payment data, if not create a new payment record
    
    let paymentAdd = await payment.findOne({ user: id });
    if (!paymentAdd) {
      // Create a new payment record for the user
      const newPayment = new payment({ user: id, payments: [obj] });
      paymentAdd = await newPayment.save();
    }
    
    
else{
    // Add the new payment data to the user's payment record
    paymentAdd.payments.push({
      name,
      type,
      date,
      amount,
      transactionId,
      products,
    });
  

    await paymentAdd.save(); 
  }
  // Save the updated payment record
   // Clear the jwt cookie
    res.clearCookie("jwt");

    // Redirect the user to the checkout page
    res.redirect("/payment/checkout");
  } catch (error) {
    console.error("Error occurred while processing payment:", error);
    res.redirect("/error"); // Redirect the user to an error page in case of an error
  }
};
exports.getBill = async (req, res) => {
  const authenticatedUserId = req.user.id; // Get authenticated user's ID
  // Get requested user's ID from URL params

  // Check if the authenticated user is trying to access their own profile

  try {
    PaymentDetails = {
      Name: req.body.Name,
      type: req.body.type,
      date: req.body.Date,
      amount: req.body.amount,
      transactionId: req.body.transactionId,
    };
    console.log(PaymentDetails);

    const user = await Login.findById(authenticatedUserId);

    const paymentIndex = req.body.paymentIndex;

    const paymentId = req.body.paymentId;

    const Payments = await payment.findOne({ "payments._id": paymentId });

    if (!Payments) {
      console.log("User payment not done yet");
    }

    const paymente = Payments.payments[paymentIndex].products;

    const htmlContent = await ejs.renderFile("./views/bill.ejs", {
      Paymente: paymente,
      user,
      PaymentDetails,
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // Send PDF as a response
    res.set("Content-Disposition", 'attachment; filename="ebill.pdf"');
    res.set("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating eBill:", error);
    res.status(500).send("Internal Server Error");
  }
};
