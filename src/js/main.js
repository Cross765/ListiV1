const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './js/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('./src/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('register-user', (event, userData) => {
  const users = store.get('users', []);
  const existingUser = users.find(u => u.username === userData.username);
  
  if (existingUser) {
    return { success: false, message: 'El usuario ya existe' };
  }
  
  users.push(userData);
  store.set('users', users);
  return { success: true, message: 'Usuario registrado correctamente' };
});

ipcMain.handle('login-user', (event, credentials) => {
  const users = store.get('users', []);
  const user = users.find(u => u.username === credentials.username);
  
  if (!user) {
    return { success: false, message: 'Usuario no encontrado' };
  }
  
  if (credentials.password && user.password && credentials.password !== user.password) {
    return { success: false, message: 'Contraseña incorrecta' };
  }
  
  return { success: true, message: 'Login exitoso', userType: user.userType };
});

ipcMain.handle('get-users', () => {
  return store.get('users', []);
});