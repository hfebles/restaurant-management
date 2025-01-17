const express = require("express");
const router = express.Router();
const ReportsController = require("../controllers/reports.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

router.get("/sales", ReportsController.getSalesReport);
router.get("/top-selling", ReportsController.getTopSellingItems);
router.get("/category-performance", ReportsController.getCategoryPerformance);
router.get("/hourly-performance", ReportsController.getHourlyPerformance);
router.get("/table-turnover", ReportsController.getTableTurnoverRate);
router.get("/daily-summary", ReportsController.getDailySummary);

module.exports = router;
