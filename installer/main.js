var AutoLaunch = require('auto-launch-allusers');

const {app} = require('electron');
var path = require('path');
var unzip = require("unzip");

var Service = require('node-windows').Service;

var fs = require('fs');

function createWindow () {
	
  fs.createReadStream(path.join(__dirname, 'insw.zip')).pipe(unzip.Extract({ path: 'C:\\Program Files\\insw' })).on('close', function () {

  fs.copyFileSync(path.join(__dirname, 'service.js'), 'C:\\Program Files\\insw\\service.js');
  fs.copyFileSync(path.join(__dirname, 'networkDisable.bat'), 'C:\\Program Files\\insw\\networkDisable.bat');
  fs.copyFileSync(path.join(__dirname, 'networkEnable.bat'), 'C:\\Program Files\\insw\\networkEnable.bat');

  //var thisAutoLauncher = new AutoLaunch({
  //    name: 'internet-switch',
  //    path: 'C:\\Program Files\\insw\\insw.exe'
  //});
  //thisAutoLauncher.enable().then(function() {
	  
	require('child_process').exec('schtasks /create /sc onlogon /tn insw /rl highest /tr "C:\Program Files\insw\insw.exe"')

    var svc = new Service({
      name:'insw4',
      description: 'Internet Switch - Automatically disable network for non-admin users - Created by Terren Gurule (ter.ren)',
      script: 'C:\\Program Files\\insw\\service.js'
    });
     
    svc.on('install',function(){
      svc.start();

      setTimeout(function() {

        require('child_process').execFile("C:\\Program Files\\insw\\insw.exe");

      },1000);

      setTimeout(function() {

        app.quit();

      },2000);
    });
     
    svc.install();

  //});

   });



}

app.on('ready', createWindow)