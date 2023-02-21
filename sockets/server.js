const http = require('http');
const SocketServer = require('ws');
const Parser = require('./events/parser');
const Event = require('./events/event');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(__dirname, '../', '.env');
dotenv.config({ path: envPath });

const SOCKET_PORT = process.env.SOCKET_PORT;
const server = http.createServer();
const wss = new SocketServer.WebSocketServer({ server });
const HMD_UPDATE_INTERVAL = 2000; //Milliseconds
const { models } = require('../sequelize');

let parser = new Parser();

wss.on('connection', (ws, req) => {
    console.log(`*** USER CONNECTED ***`);

    ws.on('message', async (data) => {
		console.log(`** MESSAGE RECEIVED **`);

		data = JSON.parse(data.toString('utf-8'));
		//console.log(data);

		let msgtype = data.MSGTYPE;
		let header = data.BLOB;
		let datatype = header.DATATYPE;
		let msgdata = header.DATA;


		//Client messages are always DATA
		if( msgtype !== "DATA") {
			console.log(msgdata);
			ws.send(JSON.stringify({ ERR: "MSGTYPE isn't DATA"}));
			return;
		}

		if( datatype == "IMU") {
			console.log(msgdata);
			parser.parseMessageIMU(msgdata, models);
		}

		if( datatype == "GPS") {
			console.log(msgdata);
			parser.parseMessageGPS(msgdata, models);
		}
	});

    // only connection message should use fully qualified JSON.
    // 'message' events should have the proper format when received.
    let connMsg = new Event({event: 'connection', payload: "None"});

	  // Sent to visionkit?
    ws.send(connMsg.stringifyMessage());
	console.log(connMsg.stringifyMessage());

	setInterval(async function() {
		try {
		  gps_val = await models.gpsmsg.findAll({ where: { id: 1 }});
		  imu_val = await models.imumsg.findAll({ where: { id: 1 }});
		  telem_val = await models.simulationstate.findAll({ where: { id: 1 }});
		  
		  const data = {
			gpsmsgs: gps_val,
			imumsgs: imu_val,
			simulationstates: telem_val
		  };
	
		  ws.send(JSON.stringify(data));
		} catch (err) {
		  console.error('Error:', err);
		}
	}, HMD_UPDATE_INTERVAL);
});

server.listen(SOCKET_PORT, () => {
   console.log(`SUITS Socket Server listening on: ${SOCKET_PORT}`);

	//const wsclient = new SocketServer.WebSocket('ws://localhost:' + process.env.SOCKET_PORT);

});
