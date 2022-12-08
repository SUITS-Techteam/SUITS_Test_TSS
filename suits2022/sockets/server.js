const http = require('http');
const SocketServer = require('ws');
const Parser = require('./events/parser');
const Event = require('./events/event');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const server = http.createServer();
const wss = new SocketServer.WebSocketServer({ server });
const clients = [];
const rooms = [];

let parser = new Parser();

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


let evasim = require('../../simulations/evasimulation.js');

wss.on('connection', (ws, req) => {
    console.log(`*** USER CONNECTED ***`);
    let connection = { id: uuidv4() };

    // only connection message should use fully qualified JSON.
    // 'message' events should have the proper format when received.
    let connMsg = new Event({event: 'connection', payload: connection.id});
    clients.push(connection);

	  // Sent to visionkit?
    ws.send(connMsg.stringifyMessage());

		setInterval(sendDataChunk, HMD_UPDATE_INTERVAL);
		function sendDataChunk() {
			let datachunk = {};

			for(const each of imu_msgs_array) {
				let parsedmsg = each[0];
				let guid = each[1];
				if( ! datachunk[guid] ){
					datachunk[guid] = {ims: [], gps: [], eva: []};
				}
				datachunk[guid].ims.push(parsedmsg);
			}

			for(const each of gps_msgs_array) {
				let parsedmsg = each[0];
				let guid = each[1];
				if( ! datachunk[guid] ){
					datachunk[guid] = {ims: [], gps: [], eva: []};
				}
				datachunk[guid].gps.push(parsedmsg);
			}

			for(const each of eva_msgs_array) {
				let parsedmsg = each[0];
				let guid = each[1];
				if( ! datachunk[guid] ){
					datachunk[guid] = {ims: [], gps: [], eva: []};
				}
				datachunk[guid].eva.push(parsedmsg);
			}

			for( const guid in datachunk) {
				//TODO send to correct client based on GUID
				console.log("Chunk send");
				console.log(datachunk[guid]);
				ws.send({ "GUID": guid, "DATA": JSON.stringify(datachunk[guid])});
				console.log("Data pushed.");
			}

			imu_msgs_array = [];
			gps_msgs_array = [];
			eva_msgs_array = [];

			if( Object.keys(datachunk).length === 0)
				console.log("No data to push.");

		}

    ws.on('message', (data) => {
			console.log(`** GOT MESSAGE **`);


			data = JSON.parse(data.toString('utf-8'));
	    console.log(data);

			let msgtype = data.id;
			let msgdata = data.fields;
			let msginfo = data.vkinfo;

			if (msgtype === "IMU") {
				parser.parseMessageIMU(msgdata, models).then((parsedmsg) => {


				if(parsedmsg)
				  //Store message to push and guid/room to push to
				  imu_msgs_array.push([parsedmsg, msginfo.Assignment]);

				});
			}

			if( msgtype === "GPS") {
				parser.parseMessageGPS(msgdata,models).then( (parsedmsg) => {

				if(parsedmsg)
					gps_msgs_array.push([parsedmsg, msginfo.Assignment] );

				});
			}

    });

  ws.on('evamessage', (data) => {
		console.log(`** GOT EVAMESSAGE **`);
		if(data.command === "create") {
			if(data.room) {
				//TODO stop or pause all other evasims and start new sim in room
				evasim = new evasim(1);
			}
		}
		if(data.command === "start") {
			evasim.start(1);

		}
		if(data.command === "pause") {
			evasim.pause();
		}
		if(data.command === "resume") {
			evasim.unpause();
		}
		if(data.command === "stop") {
			evasim.stop();
		}
		if(data.command === "control") {
			//TODO handle fan_switch,suit_power,o2_switch,aux,rca,pump
		}
		if(data.command === "failure") {
			//TODO handle o2_error,pump_error,power_error,fan_error
		}
		if(data.command === "pushmsg") {

			eva_msgs_array.push(data.data);

			//find GUID/HMD associated with room
		}
	});

});

server.listen(process.env.SOCKET_PORT, () => {
   console.log(`SUITS Socket Server listening on: ${process.env.SOCKET_PORT}`);

});
