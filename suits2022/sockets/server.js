const http = require('http');
const SocketServer = require('ws');

const studentMsg = require('./events/student');
//... add events here

require('dotenv').config();

const webServer = http.createServer();
const wss = new SocketServer({ server: webServer });

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        let parsed = JSON.parse(data.toString());

        switch(parsed.event) {
            case "register":
                studentMsg.register(parsed);
                break;
        }
    });

    ws.send('something');
});

webServer.listen(process.env.SOCKET_PORT, () => {
    console.log(`SUITS Socket Server listening on: ${process.env.SOCKET_PORT}`);
});
