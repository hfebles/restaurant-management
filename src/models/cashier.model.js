const db = require("../config/database");

class CashierModel {
  static async getActiveOrders() {
    try {
      const [rows] = await db.query(
        `SELECT 
          t.number as table_number,
          t.id as table_id,
          t.status as table_status,
          o.id as order_id,
          o.status as order_status,
          o.created_at,
          SUM(oi.quantity * mi.price) as total_amount
        FROM tables t
        LEFT JOIN orders o ON t.id = o.table_id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE t.status = 'occupied' AND o.status != 'paid'
        GROUP BY o.id
        ORDER BY t.number, o.created_at`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getOrderDetails(orderId) {
    try {
      // Obtener detalles de la orden
      const [orderDetails] = await db.query(
        `SELECT 
          o.id as order_id,
          o.table_id,
          o.status,
          o.created_at,
          t.number as table_number,
          oi.quantity,
          mi.name as item_name,
          mi.price,
          oi.notes,
          (oi.quantity * mi.price) as subtotal
        FROM orders o
        JOIN tables t ON o.table_id = t.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE o.id = ?`,
        [orderId]
      );

      // Calcular el total
      const total = orderDetails.reduce(
        (sum, item) => sum + parseFloat(item.subtotal),
        0
      );

      return {
        orderDetails,
        total,
      };
    } catch (error) {
      throw error;
    }
  }

  static async processPayment(orderId, tableId, paymentDetails) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Actualizar estado de la orden a pagado
      await connection.query('UPDATE orders SET status = "paid" WHERE id = ?', [
        orderId,
      ]);

      // Verificar si hay más órdenes activas para esta mesa
      const [activeOrders] = await connection.query(
        'SELECT COUNT(*) as count FROM orders WHERE table_id = ? AND status != "paid"',
        [tableId]
      );

      // Si no hay más órdenes activas, liberar la mesa
      if (activeOrders[0].count === 0) {
        await connection.query(
          'UPDATE tables SET status = "available" WHERE id = ?',
          [tableId]
        );
      }

      // Registrar el pago (podrías crear una tabla payments si necesitas guardar más detalles)
      await connection.query(
        `INSERT INTO payments (order_id, amount, payment_method, payment_date) 
         VALUES (?, ?, ?, NOW())`,
        [orderId, paymentDetails.amount, paymentDetails.method]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = CashierModel;
