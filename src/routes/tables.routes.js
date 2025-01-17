const express = require("express");
const router = express.Router();
const TableController = require("../controllers/table.controller");

router.get("/", TableController.getAllTables);
router.post("/", TableController.createTable);
router.put("/:tableId/status", TableController.updateTableStatus);

module.exports = router;
