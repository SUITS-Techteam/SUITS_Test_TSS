const SocketServer = require('ws');
const ws = new SocketServer.WebSocket('ws://localhost:3001');
const fs = require("fs");
const pth = require("path");

room = 1;

ws.on('message', (d) => {
	console.log("opened");
	console.log(ws.readyState)
	console.log(d.toString())
});