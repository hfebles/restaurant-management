const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/menu", require("./routes/menu.routes"));
app.use("/api/tables", require("./routes/tables.routes"));
app.use("/api/orders", require("./routes/orders.routes"));
app.use("/api/kitchen", require("./routes/kitchen.routes"));
app.use("/api/cashier", require("./routes/cashier.routes"));
app.use("/api/reports", require("./routes/reports.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin/menu", require("./routes/admin-menu.routes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
