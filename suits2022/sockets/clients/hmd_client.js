const SocketServer = require('ws');
const ws = new SocketServer.WebSocket('ws://localhost:3001');
const fs = require("fs");
const pth = require("path");

ws.on('open', (d) => {
	console.log("opened");
	console.log(ws.readyState)

	let macaddr = "1F-4E-B3-1A-9D-05";
	let msg = {"MSGTYPE": "DATA", "MACADDRESS": macaddr, "BLOB": { DATATYPE: "HMD", DATA: null}};
	ws.send(JSON.stringify(msg));
});
ws.on('message', (m) => { console.log(m.toString())});
