const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");
const passport = require('passport');
const { ensureAuthenticated ,verifyJWT }= require('../middleware/ensureAuthenticated');

router.get("/checkout",ensureAuthenticated, paymentController.getCheckOut);
router.get("/:id",ensureAuthenticated, paymentController.getPayment);
router.get("/upi/:id/:total",ensureAuthenticated,verifyJWT, paymentController.getUpi);
router.get("/netBanking/:id/:total",ensureAuthenticated,verifyJWT, paymentController.getNetBanking);
router.get("/card/:id/:total",ensureAuthenticated,verifyJWT, paymentController.getCard);
router.post("/", paymentController.postPayment);
router.post("/get-ebill", paymentController.getBill);

module.exports = router;