const OrderModel = require("../models/order.model");

class OrderController {
  static async createOrder(req, res) {
    try {
      const { tableId, items } = req.body;

      const statusOrder = await OrderModel.getStatusOrder(tableId);
      const rstStatus = statusOrder[0];
      let rstUpdateOrder;

      if (rstStatus.status === "pending") {
        rstUpdateOrder = await OrderController.updateTableOrders(
          rstStatus.id,
          items
        );
        res.status(201).json({ rstUpdateOrder });
      } else {
        const orderId = await OrderModel.createOrder(tableId, items);
        res.status(201).json({ orderId });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error creating order", error });
    }
  }

  static async getTableOrders(req, res) {
    try {
      const { tableId } = req.params;
      const orders = await OrderModel.getOrdersByTable(tableId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  }

  static async updateTableOrders(id, items) {
    try {
      const orders = await OrderModel.updateOrdersByTable(id, items);
      return orders;
    } catch (error) {
      return error;
    }
  }
}

module.exports = OrderController;
