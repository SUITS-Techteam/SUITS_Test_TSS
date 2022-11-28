const socket = require('ws').WebSocket;
const Parser = require('../events/parser');
const Gpsd = require('node-gpsd-client');
const { spawn } = require("node:child_process");
const { stringify } = require('node:querystring');

///////////////////////////////////////
// Connect to socket server
///////////////////////////////////////
const client = new socket('ws://localhost:3001');

// TODO This should be populated with actual visionkit info from the DB I assume?
// We might be able to automate this by making a request to
// getAssignment which would return the latest VKID that is unassigned


// GET /visionkitinfo/username?
const vkinfo = {
  "VKID": "VK01",
  "Type": "Student Kit",
	"Assignment": "ef0110ad-cd77-413d-af5e-88cd4091f50c"
};

///////////////////////////////////////
// Spawn IMU data-generating process
///////////////////////////////////////
let imudata;
const subprocessIMU = spawn('python', ['imu.py']);

subprocessIMU.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

subprocessIMU.stdout.on("data", (data) => {
  data = JSON.parse(data.toString());
  imudata = {"id": "IMU", "vkinfo": vkinfo, "fields": data};
  // client.send(JSON.stringify(imudata));
  client.send(JSON.stringify(imudata));
  //console.log(`stdout:\n${data}`);
});


///////////////////////////////////////
// Spawn GPS data-generating process
///////////////////////////////////////
let gpsdata;
const subprocessGPS = spawn('gpsd', ['-D5', '-N', '-n', '-S3000', '/dev/serial0']);
// GPSD options: -D debug level, -N foreground process, -n dont wait to poll, -S port

subprocessGPS.stdout.on("data", (data) => {
  console.log(data.toString());
});

const gps = new Gpsd({
  port: 3000 ,              // default
  hostname: 'localhost',   // default
  parse: true
});

gps.connect(() =>{
  console.log("gpsd connected")
});

gps.on('connected', () => {
  console.log('Gpsd connected')
  gps.watch({
    class: 'WATCH',
    json: true,
    scaled: true
  });
});

gps.on('error', err => {
  console.log(`Gpsd error: ${err.message}`);
  console.log(err);
})

gps.on('TPV', data => {
  console.log(data);
  //data = JSON.parse(data.toString());
  gpsdata = {"id": "GPS", "vkinfo": vkinfo, "fields": data};
  client.send(JSON.stringify(gpsdata));
  //console.log(data)
})
