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
        );
        ipc.of.world.on(
            'message',
            function(data){
                console.log(data)
            }
        );
    }
);

function startClient() {
	
console.log("CONNECTED!!!")

ipc.of.world.emit(
    'message',
    {command:'disable'}
)

}