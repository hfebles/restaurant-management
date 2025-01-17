const db = require("../config/database");

class AdminMenuModel {
  // Categorías
  static async createCategory(name) {
    try {
      const [result] = await db.query(
        "INSERT INTO categories (name) VALUES (?)",
        [name]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateCategory(id, name) {
    try {
      await db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCategory(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Actualizar items relacionados a null o moverlos a otra categoría
      await connection.query(
        "UPDATE menu_items SET category_id = NULL WHERE category_id = ?",
        [id]
      );

      // Eliminar la categoría
      await connection.query("DELETE FROM categories WHERE id = ?", [id]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Items del Menú
  static async createMenuItem(itemData) {
    try {
      const [result] = await db.query(
        `INSERT INTO menu_items 
        (category_id, name, description, price, image_url, available) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          itemData.categoryId,
          itemData.name,
          itemData.description,
          itemData.price,
          itemData.imageUrl,
          itemData.available,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateMenuItem(id, itemData) {
    try {
      await db.query(
        `UPDATE menu_items 
        SET category_id = ?, 
            name = ?, 
            description = ?, 
            price = ?, 
            image_url = ?, 
            available = ?
        WHERE id = ?`,
        [
          itemData.categoryId,
          itemData.name,
          itemData.description,
          itemData.price,
          itemData.imageUrl,
          itemData.available,
          id,
        ]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async deleteMenuItem(id) {
    try {
      await db.query("UPDATE menu_items SET available = false  WHERE id = ?", [
        id,
      ]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getMenuItemDetails(id) {
    try {
      const [rows] = await db.query(
        `SELECT m.*, c.name as category_name 
        FROM menu_items m 
        LEFT JOIN categories c ON m.category_id = c.id 
        WHERE m.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAllMenuItems() {
    try {
      const [rows] = await db.query(
        `SELECT m.*, c.name as category_name 
        FROM menu_items m 
        LEFT JOIN categories c ON m.category_id = c.id 
        ORDER BY c.name, m.name`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdminMenuModel;
