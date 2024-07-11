const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const checkRole = require("../middleware/checkRole");
const upload = require("../middleware/multer")


router.get("/dashboard", checkRole(), adminController.getAdmin);
router.get("/add-product", checkRole(), adminController.getAddProduct);
router.get("/manage/product", checkRole(), adminController.productManage);
router.delete(
  "/manage/product/:id",
  checkRole(),
  adminController.productManage
);

router.post("/add-product", checkRole(),upload.array("images[]", 3), adminController.postAddProduct);

// Define POST method for /manage-user
router.post("/manage-user", checkRole(), adminController.updateUser);
router.get("/manage-user", checkRole(), adminController.getManageUser);
router.put("/manage-user/:Id", checkRole(), adminController.updateRole);
router.get("/userCount", checkRole(), adminController.getUserCount);
router.get("/productSale",checkRole(), adminController.getProductSale);
router.get("/totalSale", adminController.getTotalSale);

module.exports = router;
