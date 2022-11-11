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

let datenow = Date.now();

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

    ws.send(connMsg.stringifyMessage());

    ws.on('message', (data) => {
			console.log(`** GOT MESSAGE **`);
			//console.log(data.toString('utf-8'));

			data = JSON.parse(data);

			let parsed;
			if (data.id === "IMU") {
					parsed = parser.parseMessageIMU(data.fields);
				  imu_db_id_array += [ [parsed, guid] ]

				if ( (Date.now() - datenow ) > 5000 ) {
				  //Grab all data from DB from db_id_array
				  //push/emit data to HMD
					imu_db_id_array = [];
					datenow = Date.now();
				}
			}

			if( data.id === "GPS") {
				parsed = parser.parseMessageGPS(data.fields);
				gps_db_id_array += [ [parsed, guid] ]
				if ( (Date.now() - datenow ) > 5000 ) {
				  //Grab all data from DB from db_id_array
				  //push/emit data to HMD
					imu_db_id_array = [];
					datenow = Date.now();
				}
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
