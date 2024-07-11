const express = require("express");
const router = express.Router();

const bagController = require("../controller/bagController");

router.get("/", bagController.getBag);
router.post("/add-to-bag", bagController.postBag);
router.post("/updateQuantity", bagController.postBagQuantity);
router.post("/remove", bagController.postRemove);
router.post("/clear", bagController.postClear);
module.exports = router;