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

const HMD_UPDATE_INTERVAL = 5000; //Milliseconds

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
let userlist = [];
getUsers().then( (users) => {
	userlist = users;
	//console.log(userlist)
}).catch(err => {console.log(err)});

async function getDevices() {
	const deviceData = await models.devices.findAll();
	return deviceData;
}
let devicelist = [];
getDevices().then( (devices) => {
	devicelist = devices;
	//console.log(devicelist)
}).catch(err => {console.log(err)});


wss.on('connection', (ws, req) => {
    console.log(`*** USER CONNECTED ***`);


    ws.on('message', async (data) => {
			console.log(`** GOT MESSAGE **`);

			data = JSON.parse(data.toString('utf-8'));
	    console.log(data);

			let msgtype = data.MSGTYPE;
			let blob = data.BLOB;
			let macaddr = data.MACADDRESS;


			//Client messages are always DATA
			if( msgtype !== "DATA") {
				ws.send(JSON.stringify({ ERR: "MSGTYPE isn't DATA"}));
				return;
			}


			//Simple mac address verification
			if( macaddr.split("-").length !== 6) {
				ws.send(JSON.stringify({ ERR: "MACADDRESS is invalid"}));
				return;
			}


			//Get device record associated with Macaddress

			let selected_device = null;
			for(let device of devicelist) {
				if(device.macaddress === macaddr)
					selected_device = device;
			}

			//Couldn't find device
			if(!selected_device) {
				ws.send(JSON.stringify({ ERR: "Couldn't find device."}));
				return;
			}

			let selected_user = null;
			for(let user of userlist) {
				if(user.guid === selected_device.guid)
					selected_user = user;
			}

			console.log(selected_user);

			if(!selected_user) {
				ws.send(JSON.stringify({ ERR: "Couldn't find user associated with device."}));
				return;
			}
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


			let datatype = blob.DATATYPE;
			let msgdata = blob.DATA;

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

				case "RVR":
					//TBD
					break;
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
				case "EVA":
					console.log(`** GOT EVAMESSAGE **`);
					let data = msgdata;
					if(data.execute === "command") {
						let ret_data = await simulation.commandSim( msgdata.room, msgdata.event);
						ws.send(JSON.stringify(ret_data));
					}
					if(data.execute === "control") {
						let ret_data = await simulation.controlSim( msgdata.room, msgdata.control);
						ws.send(JSON.stringify(ret_data));
					}
					if(data.execute === "failure") {
						let ret_data = await simulation.failureSim( msgdata.room, msgdata.failure);
						ws.send(JSON.stringify(ret_data));
					}
					if(data.execute === "getall") {
						let ret_data = await simulation.getAllState();
						ws.send(JSON.stringify(ret_data));
					}
					if(data.execute === "getbyroomid") {
						let ret_data = await simulation.getByRoomId(msgdata.room);
						//ws.send(JSON.stringify(ret_data));
						if(selected_user.room === msgdata.room)
							eva_msgs_array.push([ret_data,selected_user]);
					}
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

		setInterval(sendDataChunk, HMD_UPDATE_INTERVAL);
		function sendDataChunk() {

			let connectedClients = Object.keys(clients);

			let connectedClientsByRoom = {};
			for(let guid in clients) {
				let client = clients[guid];
				connectedClientsByRoom[ client.room ] = client;
			}

			//Send message data to connected, relevant clients
			for(let clientguid of connectedClients) {
					let datachunk = {MSGTYPE: "DATACHUNK",
													BLOB: { VK: { IMU: [], GPS: [] }, EVA: [], RVR: [], SPC: [] } };

					for(const each of imu_msgs_array) {
						let parsedmsg = each[0];
						let user = each[1];
						let msgguid = user.guid;
						if(clientguid == msgguid)
							datachunk.BLOB.VK.IMU.push(parsedmsg);
					}

					for(const each of gps_msgs_array) {
						let parsedmsg = each[0];
						let user = each[1];
						let msgguid = user.guid;
						if(clientguid == msgguid)
							datachunk.BLOB.VK.GPS.push(parsedmsg);
					}

					for(const each of eva_msgs_array) {
						let parsedmsg = each[0];
						let user = each[1];
						let msgguid = user.guid;
						if(clientguid == msgguid)
							datachunk.BLOB.EVA.push(parsedmsg);
					}

					//TODO send to correct client based on HMD's owner GUID

					console.log("Chunk send");
					console.log(datachunk);
				console.log(clients, clientguid);
					clients[clientguid].socket.send(JSON.stringify(datachunk));
					console.log("Data pushed.");
				}

	    //Reset data arrays
			imu_msgs_array = [];
			gps_msgs_array = [];
			eva_msgs_array = [];

			//if( Object.keys(datachunk).length === 0)
				//console.log("No data to push.");

			}

});

server.listen(process.env.SOCKET_PORT, () => {
   console.log(`SUITS Socket Server listening on: ${process.env.SOCKET_PORT}`);

	//const wsclient = new SocketServer.WebSocket('ws://localhost:' + process.env.SOCKET_PORT);

});
