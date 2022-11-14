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
			//console.log(data.toString('utf-8'));

			data = JSON.parse(data);

			let parsedid;
			if (data.id === "IMU") {
					parsedmsg = parser.parseMessageIMU(data.fields);
				  //Store message to push and guid/room to push to
				  imu_msgs_array += [ [parsedmsg, guid] ]

				/*
				if ( (Date.now() - datenow ) > HMD_UPDATE_INTERVAL ) {
				  //TODO Grab or store all data from DB from db_id_array
				  //TODO push/emit data to HMD
					imu_msgs_array = [];
					datenow = Date.now();
				}*/

			}

			if( data.id === "GPS") {
				parsedmsg = parser.parseMessageGPS(data.fields);
				gps_msgs_array += [ [parsedmsg, guid] ]

				/*
				if ( (Date.now() - datenow ) > HMD_UPDATE_INTERVAL ) {
				  //TODO Grab or store all data from DB from db_id_array
				  //TODO push/emit data to HMD
					gps_msgs_array = [];
					datenow = Date.now();
				}*/
			}


        // for (const [eventName, eventController] of Object.entries(events)) {
        //     console.log(`Event Name: ${eventName}`);
        // }

        // switch(parsed.event) {
        //     case "register":
        //         studentMsg.register(parsed);
        //         break;
        // }
    });
});

server.listen(process.env.SOCKET_PORT, () => {
    console.log(`SUITS Socket Server listening on: ${process.env.SOCKET_PORT}`);
});
