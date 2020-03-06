const wincmd = require('node-windows');
var ipc = require('node-ipc');
var fs = require('fs');

ipc.config.networkPort = "8721"

ipc.connectToNet(
	'world',
    '127.0.0.1',
	8721,
    function(){
        ipc.of.world.on(
            'connect',
            function(){
				startClient();
            }
        )
    }
);

function startClient() {
	
wincmd.elevate('"C:\\Program Files\\insw\\onsessionunlock.bat"',function(error, stdout, stderr) {

fs.readFile('C:\\Program Files\\insw\\wevtutil.txt', 'utf8', function(err, filedata) {

ipc.of.world.emit('message',{command:'user-login',username:String(filedata).split("Account Name:")[1].split("Account Domain:")[0].trim()});

setTimeout(function() {
	process.exit()
},1000)

});

});

}