/* eslint-disable no-undef */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  sendMessage: (msg) => {
    try {
      ipcRenderer.send('message', msg)
    } catch (err) {
      console.error('IPC error:', err)
    }
  },
})
