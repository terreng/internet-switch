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

        checkIfUserIsAdmin(data.username, function(isadmin) {

          if (filedata.indexOf(data.username) > -1 || isadmin) {
            console.log("Sending enabled for username: "+data.username);
            wincmd.elevate('netsh interface set interface "Ethernet" admin=enable');
            ipc.server.broadcast('message',{status:"enabled"});
          } else {
            console.log("Sending disabled for username: "+data.username);
            wincmd.elevate('netsh interface set interface "Ethernet" admin=disable');
            ipc.server.broadcast('message',{status:"disabled"});
          }

        })

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






function checkIfUserIsAdmin(username, callback) {

var exec = require('child_process').exec;

exec('net user "'+username+'" /DOMAIN', function(error, stdout, stderr){

var groups = stdout.split("Global Group memberships")[1].split("The command completed successfully.")[0].split("*");
groups.reverse()
groups.pop()
groups = groups.map(function(a) {return a.trim()})

console.log(groups)

exec('net localgroup Administrators', function(error, stdout2, stderr){

var administrators = stdout2;

var isadmin = false;

for (var i = 0; i < groups.length; i++) {
    if (administrators.indexOf(groups[i]) > -1) {
        isadmin = true;
    }
}

callback(isadmin);

});

});

}






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