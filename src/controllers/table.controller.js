const TableModel = require("../models/table.model");

class TableController {
  static async getAllTables(req, res) {
    try {
      const tables = await TableModel.getAllTables();
      res.json(tables);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tables" });
    }
  }

  static async createTable(req, res) {
    try {
      const { number } = req.body;
      const tableId = await TableModel.createTable(number);
      res.status(201).json({ id: tableId, number });
    } catch (error) {
      res.status(500).json({ message: "Error creating table" });
    }
  }

  static async updateTableStatus(req, res) {
    try {
      const { tableId } = req.params;
      const { status } = req.body;
      await TableModel.updateTableStatus(tableId, status);
      res.json({ message: "Table status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating table status" });
    }
  }
}

module.exports = TableController;
