const express = require("express");
const router = express.Router();
const KitchenController = require("../controllers/kitchen.controller");

router.get("/pending-orders", KitchenController.getPendingOrders);
router.put("/orders/:orderId/status", KitchenController.updateOrderStatus);

module.exports = router;
