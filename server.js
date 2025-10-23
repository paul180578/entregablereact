const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

db.query("CREATE DATABASE IF NOT EXISTS crud_users", (err) => {
  if (err) throw err;
  console.log("✅ Base de datos 'crud_users' verificada o creada.");

  db.changeUser({ database: "crud_users" }, (err) => {
    if (err) throw err;

    const createTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    db.query(createTable, (err) => {
      if (err) throw err;
      console.log("✅ Tabla 'users' verificada o creada.");

      const checkData = "SELECT COUNT(*) AS count FROM users";
      db.query(checkData, (err, result) => {
        if (err) throw err;
        const count = result[0].count;

        if (count === 0) {
          const seedData = `
            INSERT INTO users (name, email, phone)
            VALUES
              ('Juan Pérez', 'juan@gmail.com', '555-1234'),
              ('Ana López', 'ana@example.com', '555-5678'),
              ('Carlos García', 'carlos@gmail.com', '555-9012'),
              ('María Fernández', 'maria@example.com', '555-3456'),
              ('Lucía Torres', 'lucia@gmail.com', '555-7890')
          `;
          db.query(seedData, (err) => {
            if (err) throw err;
            console.log("✅ Datos iniciales insertados en la tabla 'users'.");
          });
        } else {
          console.log("ℹ️ La tabla 'users' ya tiene registros, no se insertaron datos iniciales.");
        }
      });
    });
  });
});

// ============ RUTAS API ============

// Obtener todos los usuarios
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      res.status(500).json({ error: "Error del servidor" });
    } else {
      res.json(results);
    }
  });
});

// Crear nuevo usuario
app.post("/users", (req, res) => {
  const { name, email, phone } = req.body;
  
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  db.query(
    "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone],
    (err, result) => {
      if (err) {
        console.error("Error al insertar usuario:", err);
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(400).json({ error: "El email ya está registrado" });
        } else {
          res.status(500).json({ error: "Error al insertar usuario" });
        }
      } else {
        res.status(201).json({ id: result.insertId, name, email, phone });
      }
    }
  );
});

// Actualizar usuario
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  db.query(
    "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
    [name, email, phone, id],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar usuario:", err);
        res.status(500).json({ error: "Error al actualizar usuario" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "Usuario no encontrado" });
      } else {
        res.json({ message: "Usuario actualizado correctamente" });
      }
    }
  );
});

// Eliminar usuario
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar usuario:", err);
      res.status(500).json({ error: "Error al eliminar usuario" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
    } else {
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    }
  });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: crud_users`);
  console.log(`🔗 Endpoints disponibles:`);
  console.log(`   GET    /users    - Obtener todos los usuarios`);
  console.log(`   POST   /users    - Crear nuevo usuario`);
  console.log(`   PUT    /users/:id - Actualizar usuario`);
  console.log(`   DELETE /users/:id - Eliminar usuario`);
});