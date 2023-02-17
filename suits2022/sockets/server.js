const http = require('http');
const SocketServer = require('ws');
const Parser = require('./events/parser');
const Event = require('./events/event');
const Simulation = require('./events/sim');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const server = http.createServer();
const wss = new SocketServer.WebSocketServer({ server });
const clients = {};

let parser = new Parser();
let simulation = new Simulation();

const HMD_UPDATE_INTERVAL = 2000; //Milliseconds

let datenow = Date.now();
let imu_msgs_array = [];
let gps_msgs_array = [];
let eva_msgs_array = [];

const events = {
    student: require('./controllers')
    //... add events here
}

const { models } = require('../sequelize');
async function getUsers() {
	const userData = await models.user.findAll();
	return userData;
}

wss.on('connection', (ws, req) => {
    console.log(`*** USER CONNECTED ***`);


    ws.on('message', async (data) => {
			console.log(`** GOT MESSAGE **`);

			data = JSON.parse(data.toString('utf-8'));
	    	console.log(data);

			let msgtype = data.MSGTYPE;
			let blob = data.BLOB;
			let datatype = blob.DATATYPE;
			let msgdata = blob.DATA;
			let room = blob.ROOM;


			//Client messages are always DATA
			if( msgtype !== "DATA") {
				ws.send(JSON.stringify({ ERR: "MSGTYPE isn't DATA"}));
				return;
			}


			// //Simple mac address verification
			// if( macaddr.split("-").length !== 6) {
			// 	ws.send(JSON.stringify({ ERR: "MACADDRESS is invalid"}));
			// 	return;
			// }


			// //Get device record associated with Macaddress

			// let selected_device = null;
			// for(let device of devicelist) {
			// 	if(device.macaddress === macaddr)
			// 		selected_device = device;
			// }

			// //Couldn't find device
			// if(!selected_device) {
			// 	ws.send(JSON.stringify({ ERR: "Couldn't find device."}));
			// 	return;
			// }

			// let selected_user = null;
			// for(let user of userlist) {
			// 	if(user.guid === selected_device.guid)
			// 		selected_user = user;
			// }

			// console.log(selected_user);

			// if(!selected_user) {
			// 	ws.send(JSON.stringify({ ERR: "Couldn't find user associated with device."}));
			// 	return;
			// }
			////////////////////////////////////////////////
			//Messages from ALLCLIENTS
			///////////////////////////////////////////////
			/*if (msgtype === "REGISTER") {
				console.log(clients)
				console.log("CLIENT is registering")
				//Several types of clients: HMDs, Visionkits, EVASims, Rovers and Spectrometers
				clients[msginfo.MacAddress] = msginfo;
				let ulist = await getUsers();
				console.log(userlist);
				return;
			}*/

			switch(datatype) {
				////////////////////////////////////////////////
				//Messages from HMD/ROVER/SPECTROMETER
				///////////////////////////////////////////////
				case "HMD":
					// registers itself to have data pushed
					console.log("User registered as HMD: ")
					console.log(selected_user)
					clients[selected_user.guid] = { user: selected_user, socket: ws };
					break;
				
				////////////////////////////////////////////////
				//Messages from ROVER
				///////////////////////////////////////////////
				case "RVR":
					//TBD
					break;
				////////////////////////////////////////////////
				//Messages from SPECTROMETER
				///////////////////////////////////////////////
				case "SPC":
					//TBD
					break;

				////////////////////////////////////////////////
				//Messages from VISIONKIT
				///////////////////////////////////////////////
				case "IMU":

					parser.parseMessageIMU(msgdata, models).then((parsedmsg) => {

					if(parsedmsg)
						//Store message to push and guid/room to push to
						imu_msgs_array.push([parsedmsg, selected_user]);
					});

					break;

				case "GPS":
					parser.parseMessageGPS(msgdata,models).then( (parsedmsg) => {

					if(parsedmsg)
						gps_msgs_array.push([parsedmsg, selected_user] );
					});

					break;

				////////////////////////////////////////////////
				//Messages from EVASIM
				///////////////////////////////////////////////
				case "STUDENT":
					console.log(`** STUDENT TEST DATA **`);
					//let data = msgdata;
					let ret_data = await simulation.getByRoomId(room);
					//ws.send(JSON.stringify(ret_data));
					eva_msgs_array.push([ret_data]);
					
					break;
			}

			return;
	});


	//Several types of clients: HMDs, Visionkits, EVASims, Rovers and Spectrometers

    // only connection message should use fully qualified JSON.
    // 'message' events should have the proper format when received.
    let connMsg = new Event({event: 'connection', payload: "None"});

	  // Sent to visionkit?
    ws.send(connMsg.stringifyMessage());
	console.log(connMsg.stringifyMessage());

		setInterval(sendDataChunk, HMD_UPDATE_INTERVAL);
		function sendDataChunk() {

			// let connectedClients = Object.keys(clients);

			// let connectedClientsByRoom = {};
			// for(let guid in clients) {
			// 	let client = clients[guid];
			// 	connectedClientsByRoom[ client.room ] = client;
			// }

			//Send message data to connected, relevant clients
			//for(let clientguid of connectedClients) {
					let datachunk = {MSGTYPE: "DATACHUNK",
									 BLOB: { VK: { IMU: [], GPS: [] }, 
									 EVA: [], RVR: [], SPC: [] } };

					for(const each of imu_msgs_array) {
						let parsedmsg = each[0];
						// let user = each[1];
						// let msgguid = user.guid;
						// if(clientguid == msgguid)
							datachunk.BLOB.VK.IMU.push(parsedmsg);
					}

					for(const each of gps_msgs_array) {
						let parsedmsg = each[0];
						// let user = each[1];
						// let msgguid = user.guid;
						// if(clientguid == msgguid)
							datachunk.BLOB.VK.GPS.push(parsedmsg);
					}

					for(const each of eva_msgs_array) {
						let parsedmsg = each[0];
						// let user = each[1];
						// let msgguid = user.guid;
						// if(clientguid == msgguid)
							datachunk.BLOB.EVA.push(parsedmsg);
					}

					//TODO send to correct client based on HMD's owner GUID

					console.log("Chunk send");
					console.log(datachunk);
				//console.log(clients, clientguid);
					ws.send(JSON.stringify(datachunk));
					console.log("Data pushed.");
				//}

	    //Reset data arrays
			imu_msgs_array = [];
			gps_msgs_array = [];
			eva_msgs_array = [];

			if( Object.keys(datachunk).length === 0)
				console.log("No data to push.");

		}

});

server.listen(process.env.SOCKET_PORT, () => {
   console.log(`SUITS Socket Server listening on: ${process.env.SOCKET_PORT}`);

	//const wsclient = new SocketServer.WebSocket('ws://localhost:' + process.env.SOCKET_PORT);

});
