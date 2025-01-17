const db = require("../config/database");

class TableModel {
  static async getAllTables() {
    try {
      const [rows] = await db.query("SELECT * FROM tables ORDER BY number");
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getTableStatus(tableId) {
    try {
      const [rows] = await db.query("SELECT * FROM tables WHERE id = ?", [
        tableId,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createTable(number) {
    try {
      const [result] = await db.query(
        "INSERT INTO tables (number) VALUES (?)",
        [number]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateTableStatus(tableId, status) {
    try {
      await db.query("UPDATE tables SET status = ? WHERE id = ?", [
        status,
        tableId,
      ]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TableModel;
