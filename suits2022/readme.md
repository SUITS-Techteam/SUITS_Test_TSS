# SUITS RESTful Telemetry Server

## Getting Started
-------------------------------

### Required Software
1. [NodeJS](https://nodejs.org/en/) (LTS): at the time of writing this is 14.17.6 

### Optional Software 
1. [Postman](https://www.postman.com/) : Used to test RESTful enpoints.

### Download -or- Clone the Telemetry Server
``` bash
$ git clone https://github.com/SUITS-2021/TelemetryServer22.git
```

### Installing  
After downloading and decompressing or cloning the project- open a terminal window (Mac/Linux) or a PowerShell window (Windows).
Change directory to the location of the Telemetry Stream Server.
*If the "suits22" directory exists, change directory to that directory.

*Tip: The directory should have a file named _"package.json"_.
 
Once in the directory, you will need to install the Node package dependencies. This is because we don't push dependencies to Git for performance reasons. 
``` bash
$ npm i
```

If all is well, you can continue. If you recieve an error: 
1. Check that your nodejs version is correct. Some packages may not be compatible with different nodejs versions. 
2. Try purging the node_modules directory then running npm i again.
``` bash
$ rm -rf ./node_modules 
$ npm i
``` 

### Preparing the database  
The SUITS Telemetry Server utilizes SQLite and an ORM (Object Relational Mapper) called Sequelize. This trivializes the setup and configuration of our database, while allowing us to generate seed data for the tables. 

To run the setup, use the following command:  
```bash 
# using node, run the setup.js script 
$ node sqlite-example-database/setup.js 
```
> *Note: Verify that the setup.js file is run from the root and not from the ./sqlite-example-database. It appears that nodejs' path will place the db at the root of the dir that setup is run from. Verify that the suitsdb/suits.sqlite is at the root of the project (the location where package.json/index.js lives).



When "Done!" prints to the console, the data has been written to the database. 

### Running the server
Now that every thing is installed and setup, we can run the server.  
Make sure you are in the same directory where you ran npm i. This is the one with the package.json file, or on older version telemetryserver22/suits2022/
``` bash
# Start the TSS
$ node index.js 
```

You should see something like the following: 
``` bash
PORT: 8080
Checking database connection...
Database connection OK!
Starting Sequelize + Express example on port 8080...
Express server started on port 8080. Try some routes, such as '/api/users'.
```

### Testing and Validating RESTful Endpoints
Testing the endpoints is a great way to validate that data is flowing from the server to the client and that you have properly defined your URIs to the correct location. 
There are a number of tools that you can use, suchas cURL (command line) or Postman (GUI). We've included a SUITS.postman_collection.json file in the suits2022/test directory. If you have installed Postman, open the application and go to File > Import. Then drag the SUITS.postman_collection.json onto the drop area under the "File" section. 
Under "My Workspace" you should see the SUITS folder. Expand it to reveal:
1. EVASimulation Commands 
    Enables the EVA simulations 
2. Data Acquisition 
    Used to gather simulation state data, rooms, and users.
3. Startup and Registration
    Used to register your user and join a room
4. LSAR 
    Lunar SAR(Search and Rescue) data functions

## EVA Errors
| Error      | Error Toggle     | DCU Toggle         | State Key | Nominal Max | Nominal Min | Error Max | Error Min |
| ---------- | ---------------- | ------------------ | --------- | ----------- | ----------- | --------- | --------- |
| Heart Rate | Fan Error (true) | Fan Switch (false) | heart_bpm | 93          | 85          | 120       | 114       |
| Suit Pressure | Pump Error (true) | Pump (false)   | p_suit    | 4.0         | 3.92        | 2.5       | 1.75      |
| Fan        | fan_error (true) | fan_switch (false) | v_fan     | 40,000.0    | 39,000.0    | 55,000.0  | 45,000.0  |
| O2 Pressure | o2_error (true) | o2_switch (false)  | p_o2      | 780         | 770         | 775       | 755       |
| O2 Rate    | o2_error (true) | o2_switch (false)  | rate_o2    | 1           | 0.5         | 0.6       | 0.4       |
| Batt Capacity | power_error (true) | suit_power (false) | cap_battery? | 45 | 60 | 30 | 29.4 |


## Quick API calls
----------------------------------

### Get Rooms:
``` REST
Method: GET
URI: /api/rooms
Required Paramters:
    -- none --
Returns: 
    id - <integer> ID of the room
    name - <string> Name of the room
    users - <integer> Number of user in the room
    createdAt - <string> Time room was created
    updatedAt - <string> Last time room was updated
Example Return:
    [{
        "id": 1,
        "name": "alpha",
        "users": 0,
        "createdAt": "2022-01-12T18:30:46.510Z",
        "updatedAt": "2022-01-12T18:30:46.510Z"
    },
    {
        "id": 2,
        "name": "beta",
        "users": 0,
        "createdAt": "2022-01-12T18:30:46.510Z",
        "updatedAt": "2022-01-12T18:30:46.510Z"
    },...]
```

### Register new user:
``` REST 
Method: POST
URI: /api/auth/register
Required Paramters:
    "username": "<string>"
    "room": <integer>
Payload Example: 
 { "username": "Nick", "room": 1 }
Returns:
    id
    username
    room
    updatedAt
    createdAt
Example Return:
    {"id":6,"username":"Nick","room":1,"updatedAt":"2022-01-12T18:46:29.177Z","createdAt":"2022-01-12T18:46:29.177Z"}
``` 

### Get Users in Room:
``` REST 
Method: POST
URI: /api/users/room/:roomid
Required 'Route' Paramters:
    roomid: <integer> id of the desired room
Returns:
    user object
Example Return:
    [{
        "id": 6,
        "username": "Nick",
        "room": 1,
        "createdAt": "2022-01-12T18:46:29.177Z",
        "updatedAt": "2022-01-12T18:46:29.177Z"
    },
    {
        "id": 7,
        "username": "John",
        "room": 1,
        "createdAt": "2022-01-12T18:57:36.414Z",
        "updatedAt": "2022-01-12T18:57:36.414Z"
    },...
    ]
```
