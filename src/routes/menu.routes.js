const express = require("express");
const router = express.Router();
const MenuController = require("../controllers/menu.controller");

router.get("/", MenuController.getMenu);
router.get("/categories", MenuController.getCategories);

module.exports = router;
