const MenuModel = require("../models/menu.model");

class MenuController {
  static async getMenu(req, res) {
    try {
      const items = await MenuModel.getAllItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Error fetching menu items" });
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = await MenuModel.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  }
}

module.exports = MenuController;
