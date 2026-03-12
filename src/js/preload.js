const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  registerUser: (userData) => ipcRenderer.invoke('register-user', userData),
  loginUser: (credentials) => ipcRenderer.invoke('login-user', credentials),
  getUsers: () => ipcRenderer.invoke('get-users')
});
