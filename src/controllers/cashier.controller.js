const CashierModel = require("../models/cashier.model");

class CashierController {
  static async getActiveOrders(req, res) {
    try {
      const orders = await CashierModel.getActiveOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching active orders" });
    }
  }

  static async getOrderDetails(req, res) {
    try {
      const { orderId } = req.params;
      const details = await CashierModel.getOrderDetails(orderId);

      // console.log(details);
      res.json(details);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order details" });
    }
  }

  static async processPayment(req, res) {
    try {
      const { orderId } = req.params;
      const { tableId, paymentDetails } = req.body;

      await CashierModel.processPayment(orderId, tableId, paymentDetails);

      res.json({
        message: "Payment processed successfully",
        orderId,
        tableId,
      });
    } catch (error) {
      res.status(500).json({ message: "Error processing payment" });
    }
  }
}

module.exports = CashierController;
