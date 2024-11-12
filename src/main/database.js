const path = require('path');
const Database = require('better-sqlite3');
const { app } = require('electron');

class DatabaseService {
  constructor() {
    const dbPath = this.getDatabasePath();
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  getDatabasePath() {
    if (process.env.NODE_ENV === 'development') {
      return path.join(__dirname, '../../dev.db');
    }
    return path.join(app.getPath('userData'), 'database.db');
  }

  initializeDatabase() {
    // Création des tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'TODO',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Préparation des requêtes
    this.createUser = this.db.prepare(`
      INSERT INTO users (email, password, name)
      VALUES (?, ?, ?)
    `);

    this.findUserByEmail = this.db.prepare(`
      SELECT * FROM users WHERE email = ?
    `);

    this.createTask = this.db.prepare(`
      INSERT INTO tasks (title, description, status)
      VALUES (?, ?, ?)
    `);

    this.getTasks = this.db.prepare(`
      SELECT * FROM tasks ORDER BY created_at DESC
    `);

    this.updateTask = this.db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    this.deleteTask = this.db.prepare(`
      DELETE FROM tasks WHERE id = ?
    `);
  }

  // Méthodes pour les utilisateurs
  createNewUser(email, password, name) {
    try {
      const result = this.createUser.run(email, password, name);
      return { id: result.lastInsertRowid, email, name };
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      throw error;
    }
  }

  getUserByEmail(email) {
    try {
      return this.findUserByEmail.get(email);
    } catch (error) {
      console.error('Erreur recherche utilisateur:', error);
      throw error;
    }
  }

  // Méthodes pour les tâches
  createNewTask(title, description, status = 'TODO') {
    try {
      const result = this.createTask.run(title, description, status);
      return {
        id: result.lastInsertRowid,
        title,
        description,
        status,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur création tâche:', error);
      throw error;
    }
  }

  getAllTasks() {
    try {
      return this.getTasks.all();
    } catch (error) {
      console.error('Erreur récupération tâches:', error);
      throw error;
    }
  }

  updateTaskById(id, { title, description, status }) {
    try {
      this.updateTask.run(title, description, status, id);
      return { id, title, description, status };
    } catch (error) {
      console.error('Erreur mise à jour tâche:', error);
      throw error;
    }
  }

  deleteTaskById(id) {
    try {
      return this.deleteTask.run(id);
    } catch (error) {
      console.error('Erreur suppression tâche:', error);
      throw error;
    }
  }
}

module.exports = new DatabaseService();