import { app, dialog, BrowserWindow, nativeImage, ipcMain } from 'electron'
import * as path from 'path'

let win: Electron.BrowserWindow
function createWindow() {
  win = new BrowserWindow({
    title: 'NS',
    icon: nativeImage.createFromPath(path.join(__dirname, '../SB128_128.ico')),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, './preload.js')
    }
  })

  win.setMenu(null)


  // win.setFullScreen(true)

  win.show()

  // Load your file
  win.loadFile('dist/index.html')
  //开启调试工具
  // win.webContents.openDevTools()

  win.on('close', (event) => {
    // 如果应用程序正在运行，而不是关闭窗口，则取消默认行为

    event.preventDefault()

    // 显示提示对话框
    dialog.showMessageBox(win, {
      type: 'question',
      buttons: ['是', '否'],
      title: '确认退出',
      message: '确定要退出应用程序吗？',
      defaultId: 1,
      cancelId: 1
    }).then((idx) => {
      if(idx.response == 0) {
        console.log('index==0，关闭')
        win.destroy()
        app.exit()
        return
      }
      if (idx.response == 1) {
        console.log('index==1，取消关闭')
        event.preventDefault()
        return
      }
      console.log('index==1，取消关闭')
      event.preventDefault()
      return
    })
  })
  win.once('leave-full-screen', () => {
    win.setFullScreen(false)
    win.maximize()
  })

  ipcMain.on('requestFullscreen', () => {
    win.setFullScreen(true)
  })
  ipcMain.on('exitFullscreen', () => {
    win.setFullScreen(false)
  })
  ipcMain.on('toggleFullscreen', () => {
    if (win.isFullScreen()) {
      win.setFullScreen(false)
    } else {
      win.setFullScreen(true)
    }
  })
  ipcMain.handle('isFullScreen', async () => {
    return win.isFullScreen()
  })
  ipcMain.on('toggleDevTools', () => {
    win.webContents.toggleDevTools()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // ipcMain.on('requestFullscreen', () => {
  //   BrowserWindow.getAllWindows()[0].setFullScreen(true)
  // })
  // ipcMain.on('exitFullscreen', () => {
  //   BrowserWindow.getAllWindows()[0].setFullScreen(false)
  // })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// 只允许一个窗口打开
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}
