const socket = require('ws').WebSocket;
const Parser = require('../events/parser');

let parser = new Parser();
let myUser = {};

/*
* Registration Data
*/
let username = "Shasta";
let university = "University of Houston";
let teamname = "coogs";

function heartbeat() {
  clearTimeout(this.pingTimeout);

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 30000 + 1000);
}

const client = new socket('ws://localhost:3001');

// client.on('open', heartbeat);
// client.on('ping', heartbeat);

client.on('message', (data) => {
    let parsed = parser.parseMessage(data, (err, msg) => {
        if(err) {
            console.error(err.msg);
            return false;
        } 

        if(msg.event === 'connection') {
            myUser.id = msg.id;
            console.log('sending...');
            // Attempt register here
            myUser.username = username;
            myUser.university = university;
            myUser.teamname = teamname;

            client.send('message', JSON.stringify(myUser));
        }
    });
});

client.on('close', function clear() {
  clearTimeout(this.pingTimeout);
});