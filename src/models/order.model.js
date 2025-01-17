const db = require("../config/database");

class OrderModel {
  static async createOrder(tableId, items) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Create new order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (table_id, status) VALUES (?, "pending")',
        [tableId]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of items) {
        await connection.query(
          "INSERT INTO order_items (order_id, menu_item_id, quantity, notes) VALUES (?, ?, ?, ?)",
          [orderId, item.menuItemId, item.quantity, item.notes || null]
        );
      }

      // Update table status
      await connection.query(
        'UPDATE tables SET status = "occupied" WHERE id = ?',
        [tableId]
      );

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getOrdersByTable(tableId) {
    try {
      const [orders] = await db.query(
        `SELECT o.*, oi.*, mi.name, mi.price 
         FROM orders o 
         JOIN order_items oi ON o.id = oi.order_id 
         JOIN menu_items mi ON oi.menu_item_id = mi.id 
         WHERE o.table_id = ? AND o.status != 'paid'
         ORDER BY o.created_at DESC`,
        [tableId]
      );
      return orders;
    } catch (error) {
      throw error;
    }
  }

  static async updateOrdersByTable(orderId, items) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const updated = [];
      for (const item of items) {
        updated.push(
          await connection.query(
            "INSERT INTO order_items (order_id, menu_item_id, quantity, notes) VALUES (?, ?, ?, ?)",
            [orderId, item.menuItemId, item.quantity, item.notes || null]
          )
        );
      }
      await connection.commit();
      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async getStatusOrder(tableId) {
    try {
      const [statusOrder] = await db.query(
        `select status, id from orders where table_id = ? order by id desc limit 1`,
        tableId
      );
      return statusOrder;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderModel;
