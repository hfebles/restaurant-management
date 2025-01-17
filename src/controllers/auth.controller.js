const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class AuthController {
  static async register(req, res) {
    try {
      const userData = req.body;

      // Validaciones básicas
      if (!userData.email || !userData.password || !userData.name) {
        return res.status(400).json({
          message: "Name, email and password are required",
        });
      }

      const userId = await UserModel.createUser(userData);

      res.status(201).json({
        message: "User created successfully",
        userId,
      });
    } catch (error) {
      if (error.message === "Email already exists") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validaciones básicas
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      // Buscar usuario
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Actualizar último login
      await UserModel.updateLastLogin(user.id);

      // Generar token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error during login" });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await UserModel.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.last_login,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  }
}

module.exports = AuthController;
