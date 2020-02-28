console.log("Version 2")

const ipc = require('node-ipc');
const wincmd = require('node-windows');
var fs = require('fs');

ipc.config.networkPort = 8721;
ipc.config.networkHost = "127.0.0.1";

ipc.serveNet(
  '127.0.0.1',
  8721,
  function(){
      ipc.server.on(
          'message',
          function(data,socket){
              //ipc.log('got a message : '.debug, data);
              /*ipc.server.emit(
                  socket,
                  'message',  //this can be anything you want so long as
                              //your client knows.
                  data+' world!'
              );*/
			if (data.command == "user-login") {
				console.log("Received user login event")
				fs.readFile('C:\\Program Files\\insw\\whitelist.txt', 'utf8', function(err, filedata) {
					console.log("Got file read")
					console.log(err)
				filedata = JSON.parse(filedata || "[]");
				console.log("Did parse")
				console.log(filedata)
				if (filedata.indexOf(data.username) > -1) {
					wincmd.elevate('netsh interface set interface "Ethernet" admin=enable');
					ipc.server.emit(socket,'message',{status:"enabled"});
				} else {
					wincmd.elevate('netsh interface set interface "Ethernet" admin=disabled');
					ipc.server.emit(socket,'message',{status:"disabled"});
				}
				});
			}
			if (data.command == "enable") {
				wincmd.elevate('netsh interface set interface "Ethernet" admin=enable');
			}
			if (data.command == "disable") {
				wincmd.elevate('netsh interface set interface "Ethernet" admin=disable');
			}
			if (data.command == "enable-always") {
				wincmd.elevate('netsh interface set interface "Ethernet" admin=enable');
				fs.readFile('C:\\Program Files\\insw\\whitelist.txt', 'utf8', function(err, filedata) {
				filedata = JSON.parse(filedata || "[]");
				filedata.push(data.username);
				fs.writeFileSync('C:\\Program Files\\insw\\whitelist.txt', JSON.stringify(filedata), 'utf8');
				})
			}
			if (data.command == "disable-always") {
				wincmd.elevate('netsh interface set interface "Ethernet" admin=disable');
				fs.readFile('C:\\Program Files\\insw\\whitelist.txt', 'utf8', function(err, filedata) {
				filedata = JSON.parse(filedata || "[]");
				if (filedata.indexOf(data.username) > -1) {
				filedata.splice(filedata.indexOf(data.username),1)
				}
				fs.writeFileSync('C:\\Program Files\\insw\\whitelist.txt', JSON.stringify(filedata), 'utf8');
				})
			}
          }
      );
  }
);

ipc.server.start();

/*
var fs = require('fs');

var knownStatus = false;

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
    require('child_process').execFile("C:\\Program Files\\insw\\networkEnable.bat");
  }

  function doDisableNetwork() {
    knownStatus = "disabled";
    require('child_process').execFile("C:\\Program Files\\insw\\networkDisable.bat");
  }

  fs.watchFile('C:\\Program Files\\insw\\status.txt', function (curr, prev) {
    checkState();
  });
  
  enableNetwork();

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
  }*/