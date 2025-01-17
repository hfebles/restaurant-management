const KitchenModel = require("../models/kitchen.model");

class KitchenController {
  static async getPendingOrders(req, res) {
    try {
      const orders = await KitchenModel.getPendingOrders();
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching pending orders" });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      await KitchenModel.updateOrderStatus(orderId, status);
      res.json({ message: "Order status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating order status", error });
    }
  }
}

module.exports = KitchenController;
