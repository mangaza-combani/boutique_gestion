const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendMessage: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  createTask: (data) => ipcRenderer.invoke('create-task', data),
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  updateTask: (id, data) => ipcRenderer.invoke('update-task', { id, data }),
  deleteTask: (id) => ipcRenderer.invoke('delete-task', id),
  // Ajoutez d'autres méthodes selon vos besoins
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  platform: process.platform
});
