const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  requestFullscreen: () => ipcRenderer.send('requestFullscreen'),
  exitFullscreen: () => ipcRenderer.send('exitFullscreen'),
  toggleFullscreen: () => ipcRenderer.send('toggleFullscreen'),
  toggleDevTools: () => ipcRenderer.send('toggleDevTools'),
  isFullScreen: async () => await ipcRenderer.invoke('isFullScreen'),
})
