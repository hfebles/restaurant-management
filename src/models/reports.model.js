const db = require("../config/database");

class ReportsModel {
  static async getSalesReport(startDate, endDate) {
    try {
      const [rows] = await db.query(
        `SELECT 
          DATE(p.payment_date) as date,
          COUNT(DISTINCT o.id) as total_orders,
          SUM(p.amount) as total_sales,
          COUNT(DISTINCT o.table_id) as tables_served
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE p.payment_date BETWEEN ? AND ?
        GROUP BY DATE(p.payment_date)
        ORDER BY date DESC`,
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getTopSellingItems(startDate, endDate, limit = 10) {
    try {
      const [rows] = await db.query(
        `SELECT 
          mi.id,
          mi.name,
          mi.category_id,
          c.name as category_name,
          SUM(oi.quantity) as total_quantity,
          SUM(oi.quantity * mi.price) as total_revenue
        FROM order_items oi
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        JOIN orders o ON oi.order_id = o.id
        JOIN categories c ON mi.category_id = c.id
        JOIN payments p ON o.id = p.order_id
        WHERE p.payment_date BETWEEN ? AND ?
        GROUP BY mi.id
        ORDER BY total_quantity DESC
        LIMIT ?`,
        [startDate, endDate, limit]
      );
      // console.log(rows);
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getCategoryPerformance(startDate, endDate) {
    try {
      const [rows] = await db.query(
        `SELECT 
          c.id,
          c.name as category_name,
          COUNT(DISTINCT o.id) as total_orders,
          SUM(oi.quantity) as total_items_sold,
          SUM(oi.quantity * mi.price) as total_revenue
        FROM categories c
        JOIN menu_items mi ON c.id = mi.category_id
        JOIN order_items oi ON mi.id = oi.menu_item_id
        JOIN orders o ON oi.order_id = o.id
        JOIN payments p ON o.id = p.order_id
        WHERE p.payment_date BETWEEN ? AND ?
        GROUP BY c.id
        ORDER BY total_revenue DESC`,
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getHourlyPerformance(date) {
    try {
      const [rows] = await db.query(
        `SELECT 
          HOUR(p.payment_date) as hour,
          COUNT(DISTINCT o.id) as total_orders,
          SUM(p.amount) as total_sales
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE DATE(p.payment_date) = ?
        GROUP BY HOUR(p.payment_date)
        ORDER BY hour`,
        [date]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getTableTurnoverRate(startDate, endDate) {
    try {
      const [rows] = await db.query(
        `SELECT 
          t.id,
          t.number as table_number,
          COUNT(DISTINCT o.id) as total_orders,
          AVG(
            TIMESTAMPDIFF(MINUTE, 
              o.created_at, 
              p.payment_date)
          ) as avg_duration_minutes
        FROM tables t
        JOIN orders o ON t.id = o.table_id
        JOIN payments p ON o.id = p.order_id
        WHERE p.payment_date BETWEEN ? AND ?
        GROUP BY t.id
        ORDER BY t.number`,
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getDailySummary(date) {
    try {
      const [rows] = await db.query(
        `SELECT 
          COUNT(DISTINCT o.id) as total_orders,
          SUM(p.amount) as total_sales,
          COUNT(DISTINCT o.table_id) as tables_served,
          AVG(p.amount) as average_ticket,
          SUM(oi.quantity) as total_items_sold
        FROM orders o
        JOIN payments p ON o.id = p.order_id
        JOIN order_items oi ON o.id = oi.order_id
        WHERE DATE(p.payment_date) = ?`,
        [date]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReportsModel;
