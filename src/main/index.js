const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: true,
      webSecurity: true
    }
  });

  // Définir une politique de sécurité plus permissive en développement
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          process.env.NODE_ENV === 'development'
            ? "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "connect-src 'self' ws://localhost:*; " +
              "img-src 'self' data: https:; " +
              "font-src 'self' data:;"
            : "default-src 'self'; " +
              "script-src 'self'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https:; " +
              "font-src 'self';"
        ]
      }
    });
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  return win;
}

function setupIpcHandlers() {
  // Authentification
  ipcMain.handle('login', async (_, { email, password }) => {
    try {
      const user = db.getUserByEmail(email);
      if (!user) {
        return { success: false, error: 'Utilisateur non trouvé' };
      }
      if (user.password !== password) {
        return { success: false, error: 'Mot de passe incorrect' };
      }
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, data: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Gestion des tâches
  ipcMain.handle('get-tasks', async () => {
    try {
      const tasks = db.getAllTasks();
      return { success: true, data: tasks };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('create-task', async (_, data) => {
    try {
      const task = db.createNewTask(data.title, data.description, data.status);
      return { success: true, data: task };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('update-task', async (_, { id, data }) => {
    try {
      const task = db.updateTaskById(id, data);
      return { success: true, data: task };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('delete-task', async (_, id) => {
    try {
      db.deleteTaskById(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}

app.whenReady().then(() => {
  try {
    setupIpcHandlers();
    
    // Créer un utilisateur par défaut si nécessaire
    const adminUser = db.getUserByEmail('admin@example.com');
    if (!adminUser) {
      db.createNewUser('admin@example.com', 'admin123', 'Administrateur');
    }
    
    createWindow();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});