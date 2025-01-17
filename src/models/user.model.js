const db = require("../config/database");
const bcrypt = require("bcryptjs");

class UserModel {
  static async createUser(userData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Verificar si el email ya existe
      const [existingUser] = await connection.query(
        "SELECT id FROM users WHERE email = ?",
        [userData.email]
      );

      if (existingUser.length > 0) {
        throw new Error("Email already exists");
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Insertar usuario
      const [result] = await connection.query(
        `INSERT INTO users (
          name, 
          email, 
          password, 
          role
        ) VALUES (?, ?, ?, ?)`,
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.role || "waiter",
        ]
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateLastLogin(userId) {
    try {
      await db.query(
        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
        [userId]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;
