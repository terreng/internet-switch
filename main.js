// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog, Tray, shell} = require('electron')
const electron = require('electron');
app.commandLine.appendSwitch('--autoplay-policy','no-user-gesture-required')

const username = require('username');

var AutoLaunch = require('auto-launch');
const trayWindow = require("electron-tray-window");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var Service = require('node-windows').Service;

// !!!!
//hide window on creation, programatically wait for firebase command and then show
// !!!!

function createWindow () {
	
  // Create the browser window.
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
	  nativeWindowOpen: true
    }
  })
  mainWindow.setMenuBarVisibility(false)
  mainWindow.setResizable(false)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  
  var tray = new Tray('off.png');
  trayWindow.setOptions({tray: tray,window: mainWindow});
  
  var thisAutoLauncher = new AutoLaunch({
      name: 'internet-switch',
  });
  thisAutoLauncher.enable();
  
  mainWindow.webContents.on('did-finish-load', () => {
	  


  });
  
  var svc = new Service({
  name:'internet-switch2',
  description: 'internet switch',
  script: 'C:\\scripts\\service\\service.js'
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();

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
