/* eslint-disable no-undef */
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), //
      contextIsolation: true, //
      nodeIntegration: false, //
    },
  })

  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    win.loadURL('http://localhost:5173') // Vite dev server
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html')) // After build
  }
}
// Listen for message from renderer
ipcMain.on('message', (event, arg) => {
  console.log('Received from renderer:', arg)
})

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
