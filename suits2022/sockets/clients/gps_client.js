const socket = require('ws').WebSocket;
const Parser = require('../events/parser');
const Gpsd = require('node-gpsd-client')

//Update host IP for server
const client = new socket('ws://192.168.1.90:3001');
const vkinfo = {
  "VKID": "VK01",
  "Type": "Student Kit"
}
//IMU START 
const {spawn} = require("node:child_process");
const subprocessIMU = spawn('python', ['imu.py']);
// subprocessIMU.stdout.on("data", (data) => {
//   client.send(data.toString());
//   //console.log(`stdout:\n${data}`);
// }) 

subprocessIMU.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
}) 

//GPSD START
const { stringify } = require('node:querystring');
const subprocessGPS = spawn('gpsd', ['-D5', '-N', '-n', '-S3000', '/dev/serial0']); 
subprocessGPS.stdout.on("data", (data) => {
  console.log(data.toString()); 
}) 

//GPSD CLIENT
const gps = new Gpsd({
  port: 3000 ,              // default
  hostname: 'localhost',   // default
  parse: true
})

gps.on('connected', () => {
  console.log('Gpsd connected')
  gps.watch({
    class: 'WATCH',
    json: true,
    scaled: true
  })
})

gps.on('error', err => {
  console.log(`Gpsd error: ${err.message}`)
})
//SEND GPS DATA
gps.on('TPV', data => {
  client.send(JSON.stringify(vkinfo))
  client.send(JSON.stringify(data));
  console.log(data)
})

gps.connect(() =>{
  console.log("gpsd connected")
})

//SEND IMU DATA
subprocessIMU.stdout.on("data", (data) => {
  client.send(data.toString());
  //console.log(`stdout:\n${data}`);
}) 


