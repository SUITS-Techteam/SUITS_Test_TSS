const ws = require('ws');

let sock = new ws.WebSocket("ws://localhost:3001");
let timers = require('timers');
let crypto = require('crypto');


let execute = process.argv[2];
let room = process.argv[3];
let event = process.argv[4];


let validargs = false;
let validexec = ["getall", "getbyroomid", "command", "control", "failure", "usage"];

if( validexec.includes(execute)   || execute === "tests"){

	validargs = true;
}

let runtests;
const NUM_TESTS = 4;
if(execute === "tests")
	runtests=true;


if( !validargs || execute === "usage") {
  console.log("USAGE: evaclientsim.js execution_command room_to_execute_in event_to_execute ");
  console.log("USAGE: execution_command is one of command/control/failure/getall/getbyroomid");
	process.exit(1);
}


function sendToSim(execute,room,param3, cb = null) {
	let msg;
	if(execute === "command")
		msg = JSON.stringify({ id: "EVA", execute: execute, fields: {room: room, event: param3} });
	if(execute === "control")
	  msg = JSON.stringify({ id: "EVA", execute: execute, fields: {room: room, control: param3} });
	if(execute === "failure")
		msg = JSON.stringify({ id: "EVA", execute: execute, fields: {room: room, failure: param3} });
	if(execute === "getall")
		msg = JSON.stringify({ id: "EVA", execute: execute });
	if(execute === "getbyroomid")
		msg = JSON.stringify({ id: "EVA", execute: execute, fields: {room: room } });
	sock.send(msg,cb);
	return msg;
}

const TEST_TIMEOUT_MS = 2000;

sock.on("open", async () => {
	console.log("socket open");

	let msg;
	if( runtests ) {

		console.log("running tests");
		//Test 1 - Start and stop for a random room
		let execcmd = "command";
		let room = crypto.randomInt(1,24);

		function test1() {
			//Test 1: Pause/Unpause/Stop
			console.log("Running test1 in room" + String(room));
			sendToSim(execcmd,room,"start", () => {
				setTimeout(sendToSim.bind(this,execcmd,room,"pause", () => {
					setTimeout(sendToSim.bind(this,execcmd,room,"unpause", ()=> {
						setTimeout(sendToSim.bind(this,execcmd,room,"stop", (err) => {

							test2();

						}),TEST_TIMEOUT_MS + 2000);
					}), TEST_TIMEOUT_MS + 1000);
				}),TEST_TIMEOUT_MS);
			});
		}

    function test2() {
			//Test 2: control pump on/control pump off/Stop
			console.log("Running test2 in room" + String(room));
			sendToSim(execcmd,room,"start", () => {
				setTimeout(sendToSim.bind(this,"control",room,"pump", () => {
					setTimeout(sendToSim.bind(this,"control",room,"pump", ()=> {
						setTimeout(sendToSim.bind(this,execcmd,room,"stop", (err) => {

							test3();

						}),TEST_TIMEOUT_MS + 2000);
					}), TEST_TIMEOUT_MS + 1000);
				}),TEST_TIMEOUT_MS);
			});

		}

    function test3() {
			//Test 3: pump failure on/pump failure off/Stop
			console.log("Running test2 in room" + String(room));
			sendToSim(execcmd,room,"start", () => {
				setTimeout(sendToSim.bind(this,"failure",room,"pump_error", () => {
					setTimeout(sendToSim.bind(this,"failure",room,"pump_error", ()=> {
						setTimeout(sendToSim.bind(this,execcmd,room,"stop", (err) => {

							test4();

						}),TEST_TIMEOUT_MS + 2000);
					}), TEST_TIMEOUT_MS + 1000);
				}),TEST_TIMEOUT_MS);
			});

		}
		function test4() {
			console.log("test suite 1, 2, 3 ran")
			process.exit(0);

		}

    test3();

	} else {
		sendToSim(execute,room,event);
		console.log("running command");

	}

});


let trues = [];
sock.on("message", (data) => {

  console.log(JSON.stringify(JSON.parse(data.toString()),null,2));

	if(!runtests)
		setTimeout( () => { process.exit(0); }, 1000);
});
