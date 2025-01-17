const express = require("express");
const router = express.Router();
const CashierController = require("../controllers/cashier.controller");

router.get("/active-orders", CashierController.getActiveOrders);
router.get("/orders/:orderId", CashierController.getOrderDetails);
router.post("/orders/:orderId/payment", CashierController.processPayment);

module.exports = router;
