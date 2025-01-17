const express = require("express");
const router = express.Router();
const AdminMenuController = require("../controllers/admin-menu.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas de categorías
router.post("/categories", AdminMenuController.createCategory);
router.put("/categories/:id", AdminMenuController.updateCategory);
router.delete("/categories/:id", AdminMenuController.deleteCategory);

// Rutas de items del menú
router.get("/items", AdminMenuController.getAllMenuItems);
router.get("/items/:id", AdminMenuController.getMenuItem);
router.post("/items", AdminMenuController.createMenuItem);
router.put("/items/:id", AdminMenuController.updateMenuItem);
router.delete("/items/:id", AdminMenuController.deleteMenuItem);

module.exports = router;
