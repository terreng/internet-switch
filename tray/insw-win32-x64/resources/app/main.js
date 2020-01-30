const {app, BrowserWindow, dialog, Tray, shell, nativeImage} = require('electron');
var path = require('path');
const username = require('username');
const trayWindow = require("electron-tray-window");

//username.sync()

var fs = require('fs')

var wincmd = require('node-windows');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var knownStatus = false;

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 250,
    height: 300,
	frame: false,
	transparent: true,
	kiosk: false,
	skipTaskbar: true,
	alwaysOnTop: true,
    webPreferences: {
	  webSecurity: false,
	  nativeWindowOpen: true,
	  nodeIntegration: true
    }
  })
  mainWindow.setMenuBarVisibility(false)
  mainWindow.setResizable(false)

  mainWindow.loadFile('index.html')
  
  var tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'off.png')));
  trayWindow.setOptions({tray: tray,window: mainWindow});

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('message', {"type":"status","data":(knownStatus == "enabled" ? true : false)});
  });

  wincmd.isAdminUser(function(isAdmin){
    if (isAdmin) {
      enableNetwork();
    } else {
      disableNetwork();
    }
  });

  function enableNetwork() {
    doEnableNetwork()
    fs.writeFileSync('C:\\Program Files\\insw\\status.txt', 'enabled', 'utf8');
  }

  function disableNetwork() {
    doDisableNetwork()
    fs.writeFileSync('C:\\Program Files\\insw\\status.txt', 'disabled', 'utf8');
  }

  function doEnableNetwork() {
    knownStatus = "enabled";
    tray.setImage(nativeImage.createFromPath(path.join(__dirname, 'on.png')));
    mainWindow.webContents.send('message', {"type":"status","data":"enabled"});
  }

  function doDisableNetwork() {
    knownStatus = "disabled";
    tray.setImage(nativeImage.createFromPath(path.join(__dirname, 'off.png')));
    mainWindow.webContents.send('message', {"type":"status","data":"disabled"});
  }

  fs.watchFile('C:\\Program Files\\insw\\status.txt', function (curr, prev) {
    checkState();
  });

  checkState();

  function checkState() {
    fs.readFile('C:\\Program Files\\insw\\status.txt', 'utf8', function(err, data) {
      if (data == "enabled" && knownStatus !== "enabled") {
        doEnableNetwork();
      }
      if (data == "disabled" && knownStatus !== "disabled") {
        doDisableNetwork();
      }
    })
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
