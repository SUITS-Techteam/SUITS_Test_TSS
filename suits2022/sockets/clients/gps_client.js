const socket = require('ws').WebSocket;
const Parser = require('../events/parser');
const Gpsd = require('node-gpsd-client');
const { spawn } = require("node:child_process");
const { stringify } = require('node:querystring');

class GPSClient {
	constructor(vkid, macaddr, vktype = "VISIONKIT") {
		this.client = new socket('ws://localhost:3001');
		this.apiurl = "http://localhost:8080";
		this.macaddr = macaddr;
		/*this.vkinfo = {
			"Name": vkid,
			"MacAddress": macaddr,
			"Type": vktype,
			"Assignment": null
		};*/

		///////////////////////////////////////
		// Connect to socket server
		///////////////////////////////////////

		this.client.on("open", () => {
      console.log("Connection to socket server established.");

			// We might be able to automate this by making a request to
			// getAssignment which would return the latest VKID that is unassigned
			// GET /visionkitinfo/username?

			/*this.getAssignment().then(result => {
				if(!result.ok) {
					console.log(data.err)
					return;
				}

				let data = result.data;

				this.vkinfo.Assignment = data.assignment;

				if(this.vkinfo.Assignment === null){
					return;
				}


				this.client.send(JSON.stringify({"msgID": "REGISTER", "senderID": this.vkinfo }));

				console.log(this.vkinfo);
				*/

				///////////////////////////////////////
				// Spawn IMU data-generating process
				///////////////////////////////////////
				this.imudata = null;
				this.subprocessIMU = spawn('python', ['imu.py']);
				this.setupIMUHandlers();


				///////////////////////////////////////
				// Spawn GPS data-generating process
				// GPSD options: -D debug level,
				//               -N foreground process,
				//               -n dont wait to poll,
				//               -S port
				///////////////////////////////////////
				this.gpsdata = null;
				this.subprocessGPS = spawn('gpsd', ['-D5', '-N', '-n', '-S3000', '/dev/serial0']);
				this.gps = new Gpsd({
					port: 3000 ,              // default
					hostname: 'localhost',   // default
					parse: true
				});
				this.setupGPSHandlers();

				console.log("GPS client started")
			//});

		});
	};

	setupIMUHandlers() {
		let subprocessIMU = this.subprocessIMU;
		let imudata = this.imudata;
		//let vkinfo = this.vkinfo;
		let client = this.client;

		subprocessIMU.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
		});

		subprocessIMU.stdout.on("data", (data) => {
			data = { DATATYPE: "IMU", DATA: JSON.parse(data.toString())};
			//imudata = {"msgID": "IMU", "senderID": vkinfo, "fields": data};
			imudata = {"MSGTYPE": "DATA", "MACADDRESS": this.macaddr, "BLOB": data};
			// client.send(JSON.stringify(imudata));
			client.send(JSON.stringify(imudata));
			//console.log(`stdout:\n${data}`);
		});
	}

	setupGPSHandlers() {
		let subprocessGPS = this.subprocessGPS;
		let gps = this.gps;
		let gpsdata = this.gpsdata;
		//let vkinfo = this.vkinfo;
		let client = this.client;

		subprocessGPS.stdout.on("data", (data) => {
			console.log(data.toString());
		});

		gps.connect(() =>{
			console.log("gpsd connected");
		});

		gps.on('connected', () => {
			console.log('Gpsd connected');
			gps.watch({
				class: 'WATCH',
				json: true,
				scaled: true
			});
		});

		gps.on('error', err => {
			console.log(`Gpsd error: ${err.message}`);
			console.log(err);
		});

		gps.on('TPV', data => {
			data = { DATATYPE: "GPS", DATA: data };
			//console.log(data);
			//data = JSON.parse(data.toString());
			//gpsdata = {"msgID": "GPS", "senderID": vkinfo, "fields": data};
			gpsdata = {"MSGTYPE": "DATA", "MACADDRESS": this.macaddr, "BLOB": data};
			client.send(JSON.stringify(gpsdata));
			//console.log(data)
		});

	}

/*	async getAssignment() {
		const res = await fetch(this.apiurl + "/api/auth/assignment", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				//'Content-Type': 'application/json',
			},
			body: "vk="+this.vkinfo.Name
		});
		return res.json();
	}*/
}


let gpsclient = new GPSClient("VK01", "B7-02-BC-4A-E2-61");
