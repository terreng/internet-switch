const {app} = require('electron');

var AutoLaunch = require('auto-launch');

var Service = require('node-windows').Service;

var fs = require('fs');

function createWindow () {

  fs.copyFileSync('service.js', 'C:\\Windows\\ProgramFiles\\insw\\service.js');
  fs.copyFileSync('networkDisable.bat', 'C:\\Windows\\ProgramFiles\\insw\\networkDisable.bat');
  fs.copyFileSync('networkEnable.bat', 'C:\\Windows\\ProgramFiles\\insw\\networkEnable.bat');
  fs.copyFileSync('insw.exe', 'C:\\Windows\\ProgramFiles\\insw\\insw.exe');

  var thisAutoLauncher = new AutoLaunch({
      name: 'internet-switch',
      path: 'C:\\Windows\\ProgramFiles\\insw\\insw.exe'
  });
  thisAutoLauncher.enable().then(function() {

    var svc = new Service({
      name:'insw1',
      description: 'Internet Switch - Automatically disable network for non-admin users - Created by Terren Gurule (ter.ren)',
      script: 'C:\\Windows\\ProgramFiles\\insw\\service.js'
    });
     
    svc.on('install',function(){
      svc.start();

      setTimeout(function() {

        require('child_process').execFile("C:\\Windows\\ProgramFiles\\insw\\insw.exe");

      },1000);

      setTimeout(function() {

        app.quit();

      },2000);
    });
     
    svc.install();

  });

}

app.on('ready', createWindow)