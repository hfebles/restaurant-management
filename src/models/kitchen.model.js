const db = require("../config/database");

class KitchenModel {
  static async getPendingOrders() {
    try {
      const [rows] = await db.query(
        `SELECT 
          o.id as order_id,
          o.table_id,
          o.status,
          o.created_at,
          t.number as table_number,
          GROUP_CONCAT(
            CONCAT(oi.quantity, 'x ', mi.name, 
            CASE WHEN oi.notes IS NOT NULL 
              THEN CONCAT(' (', oi.notes, ')') 
              ELSE '' 
            END)
            SEPARATOR ', '
          ) as items
        FROM orders o
        JOIN tables t ON o.table_id = t.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE o.status IN ('pending', 'in_progress')
        GROUP BY o.id
        ORDER BY o.created_at ASC`
      );
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateOrderStatus(orderId, status) {
    try {
      await db.query("UPDATE orders SET status = ? WHERE id = ?", [
        status,
        orderId,
      ]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = KitchenModel;
