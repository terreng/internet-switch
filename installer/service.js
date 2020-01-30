var fs = require('fs');

var knownStatus = false;

  function enableNetwork() {
    doEnableNetwork()
    fs.writeFile('C:\\Windows\\ProgramFiles\\insw\\status.txt', 'enabled', 'utf8');
  }

  function disableNetwork() {
    doDisableNetwork()
    fs.writeFile('C:\\Windows\\ProgramFiles\\insw\\status.txt', 'disabled', 'utf8');
  }

  function doEnableNetwork() {
    knownStatus = "enabled";
    require('child_process').execFile("C:\\Windows\\ProgramFiles\\insw\\networkEnable.bat");
  }

  function doDisableNetwork() {
    knownStatus = "disabled";
    require('child_process').execFile("C:\\Windows\\ProgramFiles\\insw\\networkDisable.bat");
  }

  fs.watchFile('C:\\Windows\\ProgramFiles\\insw\\status.txt', function (curr, prev) {
    checkState();
  });

  checkState();

  function checkState() {
    fs.readFile('C:\\Windows\\ProgramFiles\\insw\\status.txt', 'utf8', function(err, data) {
      if (data == "enabled" && knownStatus !== "enabled") {
        doEnableNetwork();
      }
      if (data == "disabled" && knownStatus !== "disabled") {
        doDisableNetwork();
      }
    })
  }

enableNetwork();