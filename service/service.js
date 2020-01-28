var child = require('child_process').execFile;
var executablePath = "C:\\scripts\\networkEnable.bat";

child(executablePath, function(err, data) {
	console.log(err)
});