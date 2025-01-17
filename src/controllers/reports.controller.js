const ReportsModel = require("../models/reports.model");

class ReportsController {
  static async getSalesReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const report = await ReportsModel.getSalesReport(startDate, endDate);
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Error generating sales report" });
    }
  }

  static async getTopSellingItems(req, res) {
    try {
      const { startDate, endDate, limit } = req.query;
      const report = await ReportsModel.getTopSellingItems(
        startDate,
        endDate,
        parseInt(limit)
      );

      // console.log(report);
      res.json(report);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error generating top selling items report" });
    }
  }

  static async getCategoryPerformance(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const report = await ReportsModel.getCategoryPerformance(
        startDate,
        endDate
      );
      res.json(report);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error generating category performance report" });
    }
  }

  static async getHourlyPerformance(req, res) {
    try {
      const { date } = req.query;
      const report = await ReportsModel.getHourlyPerformance(date);
      res.json(report);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error generating hourly performance report" });
    }
  }

  static async getTableTurnoverRate(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const report = await ReportsModel.getTableTurnoverRate(
        startDate,
        endDate
      );
      res.json(report);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error generating table turnover report" });
    }
  }

  static async getDailySummary(req, res) {
    try {
      const { date } = req.query;
      const summary = await ReportsModel.getDailySummary(date);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Error generating daily summary" });
    }
  }
}

module.exports = ReportsController;
