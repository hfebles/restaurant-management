const AdminMenuModel = require("../models/admin-menu.model");

class AdminMenuController {
  // Categorías
  static async createCategory(req, res) {
    try {
      const { name } = req.body;
      const categoryId = await AdminMenuModel.createCategory(name);
      res.status(201).json({ id: categoryId, name });
    } catch (error) {
      res.status(500).json({ message: "Error creating category" });
    }
  }

  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await AdminMenuModel.updateCategory(id, name);
      res.json({ message: "Category updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating category" });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      await AdminMenuModel.deleteCategory(id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting category" });
    }
  }

  // Items del Menú
  static async createMenuItem(req, res) {
    try {
      const itemData = req.body;
      const itemId = await AdminMenuModel.createMenuItem(itemData);
      res.status(201).json({ id: itemId, ...itemData });
    } catch (error) {
      res.status(500).json({ message: "Error creating menu item" });
    }
  }

  static async updateMenuItem(req, res) {
    try {
      const { id } = req.params;
      const itemData = req.body;
      await AdminMenuModel.updateMenuItem(id, itemData);
      res.json({ message: "Menu item updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating menu item" });
    }
  }

  static async deleteMenuItem(req, res) {
    try {
      const { id } = req.params;
      await AdminMenuModel.deleteMenuItem(id);
      res.json({ message: "Menu item deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Error deleting menu item",
      });
    }
  }

  static async getMenuItem(req, res) {
    try {
      const { id } = req.params;
      const item = await AdminMenuModel.getMenuItemDetails(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Error fetching menu item" });
    }
  }

  static async getAllMenuItems(req, res) {
    try {
      const items = await AdminMenuModel.getAllMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Error fetching menu items" });
    }
  }
}

module.exports = AdminMenuController;
