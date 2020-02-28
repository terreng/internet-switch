const {app, BrowserWindow, dialog, Tray, shell, nativeImage, ipcMain} = require('electron');
var path = require('path');
const username = require('username');
const trayWindow = require("electron-tray-window");

var ipc=require('node-ipc');

//username.sync()

var fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function beforeCreateWindow() {

ipc.connectToNet(
	'world',
    '127.0.0.1',
	8721,
    function(){
        ipc.of.world.on(
            'connect',
            function(){
				createWindow();
            }
        );
        ipc.of.world.on(
            'disconnect',
            function(){
				app.quit();
            }
        );
        ipc.of.world.on(
            'message',
            function(data){
				console.log(data)
                if (data.status == "enabled") {
					tray.setImage(nativeImage.createFromPath(path.join(__dirname, 'on.png')));
					mainWindow.webContents.send('message', {"type":"status","data":"enabled"});
				}
                if (data.status == "disabled") {
					
					tray.setImage(nativeImage.createFromPath(path.join(__dirname, 'off.png')));
					mainWindow.webContents.send('message', {"type":"status","data":"disabled"});
				}
            }
        );
    }
);
	
}

var tray;

function createWindow() {

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
  
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'off.png')));
  trayWindow.setOptions({tray: tray,window: mainWindow});

  mainWindow.webContents.on('did-finish-load', () => {
    ipc.of.world.emit('message',{command:'user-login',username:username.sync()})
  });

  ipcMain.on('asynchronous-message', (event, arg) => {
	  console.log(arg)
    if (arg == "enable") {
      ipc.of.world.emit('message',{command:'enable'})
	  tray.setImage(nativeImage.createFromPath(path.join(__dirname, 'on.png')));
	  mainWindow.webContents.send('message', {"type":"status","data":"enabled"});
    }
    if (arg == "disable") {
      ipc.of.world.emit('message',{command:'disable'})
	  tray.setImage(nativeImage.createFromPath(path.join(__dirname, 'off.png')));
	  mainWindow.webContents.send('message', {"type":"status","data":"disabled"});
    }
    if (arg == "enable-always") {
      ipc.of.world.emit('message',{command:'enable-always',username:username.sync()})
	  tray.setImage(nativeImage.createFromPath(path.join(__dirname, 'on.png')));
	  mainWindow.webContents.send('message', {"type":"status","data":"enabled"});
    }
    if (arg == "disable-always") {
      ipc.of.world.emit('message',{command:'disable-always',username:username.sync()})
	  tray.setImage(nativeImage.createFromPath(path.join(__dirname, 'off.png')));
	  mainWindow.webContents.send('message', {"type":"status","data":"disabled"});
    }
  })

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
app.on('ready', beforeCreateWindow)

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
