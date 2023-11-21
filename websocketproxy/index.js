//Simple local Websocket server for forwarding to
//minecraft server
//use sniffcraft-windows-1.12.2.exe 25564 localhost
//to get packages
import { WebSocketServer } from 'ws';
import * as net from "net";
let wss;
function startconn(){
  wss = new WebSocketServer({ port: 30023 });
}

startconn();


wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    let a;
  
    try {
        if(ws.client) {
          ws.client.write(data);
          return;
        }
      
        a = JSON.parse(data);
      
        if(a?.payload?.host && a?.payload?.port ){
          ws.client=new net.Socket();
          ws.client.connect(a?.payload?.port, a?.payload?.host, function() {
          });
          ws.client.on('data', function(data) {
            ws.send(data);
          });
          
          ws.client.on('close', function() {
            ws.client.destroy(); // kill client after server's response
          });
        }
        
    } catch (e) {
        return console.error(e); // error in the above string (in this case, yes)!
    }
  });
});

var RECONNECT_TIMEOUT = 5; //number of seconds for reconnection when disconnected or socket error


wss.on("close", function() {
	node.log("!!!!!!!!!!!Connection closed: "+node.path);
	node.emit("closed");
	node.logged = false;
	if (!node.closing) {
		clearTimeout(node.tout);
		node.tout = setTimeout(function() {
			startconn();
		}, node.RECONNECT_TIMEOUT * 1000); // try to reconnect
	}
});


wss.on("error", function(err) {
	node.error("!!!!!!!!!!!Websocket " + err);
	node.emit("error");
	node.logged = false;
	if (!node.closing) {
		clearTimeout(node.tout);
		node.tout = setTimeout(function() {
			startconn();
		}, node.RECONNECT_TIMEOUT * 1000); // try to reconnect
	}
});

process.on('uncaughtException', function (err) {
  console.log(err);
}); 