const ipc = require('node-ipc');
const wincmd = require('node-windows');

require('child_process').exec('netsh interface set interface "Ethernet" admin=enable', function(error, stdout, stderr) {console.log(error);console.log(stdout);console.log(stderr)})
elevate('netsh interface set interface "Ethernet" admin=enable');

ipc.config.networkPort = "8721"

ipc.serve(
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
              elevate('netsh interface set interface "Ethernet" admin=disable');
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