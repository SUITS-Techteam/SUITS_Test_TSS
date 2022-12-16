/*
let evasim = require('../../simulations/evasimulation.js');

console.log(evasim);
evasim = new evasim(1);
evasim.start(1);

*/


const ws = require('ws');
let sock = new ws.WebSocket("ws://localhost:3001");

sock.on("open", (data) => {

	let msg = JSON.stringify({ id: "EVA", execute: "command", fields: {room: 1, event: "start"} });

	sock.send(msg);
});


sock.on("message", (data) => {

	console.log(data.toString())
});
