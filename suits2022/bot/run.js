require('dotenv').config({
    path: '../.env'
});
const Spawner = require('./spawner');
const DataEvents = require('./data_events');
const { exec } = require('child_process');
const config = require('./config.json');
const moment = require('moment');

let apiURI = `${process.env.API_URL}:${process.env.API_PORT}`;

// What to do?
// Each room should have a:
//  TS: Test Subject
//  LB: Location Beacon (GPS location for the TS)
//  LS: LunaSAR User
// The server by def generates 24 rooms Alpha - Omega
// The Bot should register users for a set of rooms with a minimum of 3 rooms.
// Each user should perform some predefined actions based on their involvement.
//  TS user will need to:
//      Register a user
//      Consume EVA State Data
//      Consume LB Location Data
//      Consume LSAR Event Messages
//      Send LSAR Message
//  LS user will need to:
//      Register a user with a default room
//      Set a location

let tsUsers = [
    { name: "NArmstrong", room: 1 },
    { name: "BAldrin",    room: 2 },
    { name: "ECernan",    room: 3 },
    { name: "JLovell",    room: 4 },
    { name: "AShepard",   room: 5 },
    { name: "HSchmitt",   room: 6 },
    { name: "MCollins",   room: 7 },
    { name: "JYoung",     room: 8 },
    { name: "PConrad",    room: 9 },
    { name: "JSwigert",   room: 10 }
];

let locRange = [
    { lat: 35.32961, lon: -111.33887 },
    { lat: 34.90306, lon: -110.82323 }
]

let registeredUsers = [];
let tc;
let roomOpStates = [];

async function init() {
    exec('cd .. && node ./sqlite-example-database/setup.js', async (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          console.error(`Failed to reset DB. Terminating Process!`);
          return;
        }

        // We should get something back from db reset/setup func.
        // If not... it broke or the bot is being run from another location.
        if(stdout !== '') {
            console.log('DB has been reset. Starting bot process...');            
            start();            

            console.log(`Created users ${registeredUsers.length}`);
        }
      });
}

async function start() {
    
    for(const user of tsUsers) {
        await createUser(user).then(d => {            
            d['dataEvents'] = new DataEvents(d, apiURI);
            registeredUsers.push(d);
        });
    };

    await pushInitLocation();
    await TC_Join();

    // Start interval ticks
    await tickLocation();

    // Wait 2 sec before starting
    setTimeout(() => {
        startEVATelem(); // Test room 1
    }, 2000);

    // Wait 4 sec then switch to room 2
    setTimeout(() => {
        tc.dataEvents.UpdateUserRoom(2, (err, res) => {
            if(err) {
                console.log(err);
            }
            tc.room = 2;
            startEVATelem(); // Test room 2
        });
    }, 10000);
}

async function pushInitLocation() {
    for(const user of registeredUsers) {
        new Promise(resolve => {
            user.dataEvents.LocationSet((err, res) => {
                return resolve();
            });
        }) 
    }
}

function createUser(user) {
    let spawner = new Spawner(apiURI);
    return new Promise(resolve => {
        spawner.connect(user.name, user.room, async (err, result) => {
            if(err) { 
                console.log(err);
                return;
            }            
            let start_pos = await BeaconInitLoc();
            result.data.pos = start_pos;
            resolve(result.data);           
        });
    });
}

// Isolated TC based events.
async function TC_Join() {
    let spawner = new Spawner(apiURI);
    return new Promise(resolve => {
        spawner.connect("conductor", 1, async (err, result) => {
            if(err) { 
                console.log(err);
                return;
            }
            tc = result.data;
            tc["dataEvents"] = new DataEvents(tc, apiURI);

            console.log(`Test Conductor Created!`);

            resolve(result.data);
        });
    });
}



function BeaconInitLoc() {
    let lat = (Math.random() * (locRange[1].lat - locRange[0].lat) + locRange[1].lat).toFixed(5) * 1;
    let lon = (Math.random() * (locRange[1].lon - locRange[0].lon) + locRange[1].lon).toFixed(5) * 1;

    return { lat, lon };
}

//********* LOOP EVENTS *********/
async function tickLocation() {
    setInterval(async () => {
        for(const user of registeredUsers) {
            let pos = await BeaconInitLoc();
            user.pos = pos;
            new Promise(resolve => {
                user.dataEvents.locationUpdate(user.pos.lat, user.pos.lon, (err, res) => {
                    return resolve();
                });
            }) 
        }
    }, config.loc_tick);
}

async function startEVATelem() {
    console.log(`Start EVA for ${tc.room}`);
    let rmoId = roomOpStates.findIndex(x => x.room === tc.room);
    let toggle;
    if(rmoId !== -1) {

        toggle = roomOpStates[rmoId].operation;
        toggle = (toggle === 'start')? 'stop' : 'start';
        roomOpStates[rmoId].operation = toggle;
        
    } else {
        // We need to create a state record
        toggle = 'start';
        await roomOpStates.push({ room: tc.room, operation: toggle, startTime: moment().format('HH:mm:ss') });
        console.log(roomOpStates);
    }

    tc.dataEvents.ToggleEVA(tc.room, toggle, (err, res) => {
        if(res) {
            if(res.ok) {
                // roomOpStates next should always be len -1... right?
                console.log(`TSS EVA mode: ${toggle} set for room: ${tc.room} at time ${roomOpStates[roomOpStates.length -1].startTime}`);
                TSListener(tc.room); // Have the TS start listening
            } else {
                console.log("Error starting sim");
            }
        } else {
            console.log(err);
        }
    });
}

function TSListener(room) {
    // Finds the user and gets the telemetry on a 2 second interval
    let user = registeredUsers.find(x => x.room === room);
    let listener = setInterval(() => {
        user.dataEvents.TelemetryGet((err, res) => {
            
        });
    }, config.telem_tick);
    
    // We add the interval to the user so we can kill it later
    user['listener'] = listener;
}


// Start Your Engines!
init();
