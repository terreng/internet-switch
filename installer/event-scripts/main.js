const wincmd = require('node-windows');
var ipc=require('node-ipc');

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
	
console.log("CONNECTED!!!")

//ipc.of.world.emit('message',{command:'user-login',username:username.sync()})

}

wincmd.elevate('wevtutil qe Security "/q:*[System [(EventID=4778)]]" /rd:true /f:text /c:1 > "C:\\Program Files\\insw\\wevtutil.txt"',function(error, data) {

});