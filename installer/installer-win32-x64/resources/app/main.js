//var AutoLaunch = require('auto-launch-allusers');
var fs = require('fs');

const {app} = require('electron');
var path = require('path');
var extract = require("extract-zip");
const wincmd = require('node-windows');

function createWindow() {
	
	console.log("hello")
	
  extract(path.join(__dirname, 'insw.zip'), { dir: 'C:\\Program Files\\insw' }, function (err) {
	  console.log(err)
	  
  extract(path.join(__dirname, 'service.zip'), { dir: 'C:\\Program Files\\insw\\service2' }, function () {

  fs.copyFileSync(path.join(__dirname, 'networkDisable.bat'), 'C:\\Program Files\\insw\\networkDisable.bat');
  fs.copyFileSync(path.join(__dirname, 'networkEnable.bat'), 'C:\\Program Files\\insw\\networkEnable.bat');

  //var thisAutoLauncher = new AutoLaunch({
  //    name: 'internet-switch',
  //    path: 'C:\\Program Files\\insw\\insw.exe'
  //});
  //thisAutoLauncher.enable().then(function() {
	  
	//require('child_process').exec('schtasks /create /sc onlogon /tn insw /rl highest /tr "C:\\Windows\\System32\\cmd.exe /C \"C:\\insw\\insw.exe\""')

       wincmd.elevate("node service-installer\\main.js");

  //});

   });

 });

}

app.on('ready', createWindow)