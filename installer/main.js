//var AutoLaunch = require('auto-launch-allusers');
var fs = require('fs');

const {app,dialog} = require('electron');
var path = require('path');
var extract = require("extract-zip");
const wincmd = require('node-windows');

function createWindow() {
	
	console.log("hello")
	
  extract(path.join(__dirname, 'insw.zip'), { dir: 'C:\\Program Files\\insw' }, function (err) {
	  console.log(err)
	  
  extract(path.join(__dirname, 'service.zip'), { dir: 'C:\\Program Files\\insw\\newservice' }, function () {
  extract(path.join(__dirname, 'service-installer.zip'), { dir: 'C:\\Program Files\\insw\\service-installer' }, function () {

  fs.copyFileSync(path.join(__dirname, 'networkDisable.bat'), 'C:\\Program Files\\insw\\networkDisable.bat');
  fs.copyFileSync(path.join(__dirname, 'networkEnable.bat'), 'C:\\Program Files\\insw\\networkEnable.bat');
  fs.copyFileSync(path.join(__dirname, 'node.exe'), 'C:\\Program Files\\insw\\node.exe');

  //var thisAutoLauncher = new AutoLaunch({
  //    name: 'internet-switch',
  //    path: 'C:\\Program Files\\insw\\insw.exe'
  //});
  //thisAutoLauncher.enable().then(function() {
	  
	//require('child_process').exec('schtasks /create /sc onlogon /tn insw /rl highest /tr "C:\\Windows\\System32\\cmd.exe /C \"C:\\insw\\insw.exe\""')

       //var process = require('child_process').fork('service-installer/main.js');
	   
	   /*wincmd.elevate('node.exe service-installer\\main.js',{},function(err2, data) {
		   app.quit();
	   });*/
	   
	   /*process.on('error', function (err) {
		   dialog.showErrorBox("Error:", err.toString());
	   });
	   
	   
	    process.on('exit', function (code) {
		   dialog.showErrorBox("Exit:", code.toString());
	   });*/
	   
/*var Service = require('node-windows').Service;

var svc = new Service({
  name:'insw_new7',
  description: 'Internet Switch - Automatically disable network for non-admin users - Created by Terren Gurule (ter.ren)',
  script: 'C:\\Program Files\\insw\\newservice\\service.js',
  execPath: "C:\\Program Files\\insw\\node.exe"
});
 
svc.on('install',function(){
  svc.start();
});
 
svc.install();*/

wincmd.elevate('"C:/Program Files/insw/node.exe" "C:/Program Files/insw/service-installer/main.js"');

  //});

   });
   });

 });

}

app.on('ready', createWindow)