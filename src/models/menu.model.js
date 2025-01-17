const db = require("../config/database");

class MenuModel {
  static async getAllItems() {
    try {
      const [rows] = await db.query(
        "SELECT m.*, c.name as category_name FROM menu_items m LEFT JOIN categories c ON m.category_id = c.id WHERE m.available = true"
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getItemsByCategory(categoryId) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM menu_items WHERE category_id = ? AND available = true",
        [categoryId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getCategories() {
    try {
      const [rows] = await db.query("SELECT * FROM categories");
      // console.log(rows);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MenuModel;
