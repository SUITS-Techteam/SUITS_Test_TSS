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
	console.log(userlist)
}).catch(err => {console.log(err)});

wss.on('connection', (ws) => {
    console.log(`*** USER CONNECTED ***`);
    let connection = { id: uuidv4() };

    // only connection message should use fully qualified JSON.
    // 'message' events should have the proper format when received.
    let connMsg = new Event({event: 'connection', payload: connection.id});
    clients.push(connection);

	  // Sent to visionkit?
    ws.send(connMsg.stringifyMessage());

	/*setTimeout(sendDataChunk, HMD_UPDATE_INTERVAL);
			function sendDataChunk() {
				let datachunk = {}

				for(let each in imu_msgs_array) {

					let parsedmsg = each[0];
					let guid = each[1];
					if( ! (guid in datachunk) ){
					   datachunk[guid] = {ims: [], gps: []};
					}
					datachunk.ims.push(parsedmsg);
				}

				for(let each in gps_msgs_array) {
				  let parsedmsg = each[0];
					let guid = each[1];
					if( ! (guid in datachunk) ){
							datachunk[guid] = {ims: [], gps: []};
					}
					datachunk.gps.push(parsedmsg);
				}

				for( key in datachunk) {
					//TODO send to correct client based on GUID
					ws.send(datachunk[key]);
				}

				imu_msgs_array = [];
				gps_msgs_array = [];
			}
		*/

    ws.on('message', (data) => {
			console.log(`** GOT MESSAGE **`);
			data = JSON.parse(data.toString('utf-8'));

			let msgtype = data.id;
			let msgdata = data.fields;
			let msginfo = data.vkinfo;

			if (msgtype === "IMU") {
				parser.parseMessageIMU(msgdata, models).then((parsedmsg) => {

				  //Store message to push and guid/room to push to
				  imu_msgs_array += [ [parsedmsg, msginfo.Assignment] ];

					/*
						if ( (Date.now() - datenow ) > HMD_UPDATE_INTERVAL ) {
						//TODO Grab or store all data from DB from db_id_array
						//TODO push/emit data to HMD
						imu_msgs_array = [];
						datenow = Date.now();
						}*/
				});
			}

			if( msgtype === "GPS") {
				parser.parseMessageGPS(msgdata,models).then( (parsedmsg) => {

					gps_msgs_array += [ [parsedmsg, msginfo.Assignment] ];

					/*
						if ( (Date.now() - datenow ) > HMD_UPDATE_INTERVAL ) {
						//TODO Grab or store all data from DB from db_id_array
						//TODO push/emit data to HMD
						gps_msgs_array = [];
						datenow = Date.now();
						}*/
				});
			}

    });

});

server.listen(process.env.SOCKET_PORT, () => {
   console.log(`SUITS Socket Server listening on: ${process.env.SOCKET_PORT}`);

});
