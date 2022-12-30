
const SocketServer = require('ws');
const ws = new SocketServer.WebSocket('ws://localhost:3001')
const fs = require("fs");
const pth = require("path");

ws.on('open', (d) => {
	console.log("opened");
	console.log(ws.readyState)

	let data = fs.readFileSync(pth.join(__dirname,"testdata2"));
	let data2 = data.toString().split("\n");
	for(let each of data2) {
		try {
			let j = JSON.parse(each)
			ws.send(JSON.stringify(j));
			//console.log(j)
		} catch(e) {
			//console.log(e)
		}
	}
});
ws.on('message', (m) => { console.log(m.toString())});
