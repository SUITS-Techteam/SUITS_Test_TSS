# Getting Started

1. Clone the SUITS TSS-Legacy Repo
2. Ensure that you have NodeJS installed
3. Make sure you are on the "student-branch" branch
4. Navigate to the "suits2020" directory

## Starting the Simulation

1. From the root directory, run `node sqlite-example-database/setup.js`
    * You should see this message: 
    ```
    DB Path: C:/Users/Geraldo/SUITS/TSS-Legacy/suits2022/suitsdb/suits.sqlite
    Will rewrite the SQLite example database, adding some dummy data.
    Done!
    ```
2. Now run `index.js`
    * You should see this message:
    ```
    DB Path: C:/Users/Geraldo/SUITS/TSS-Legacy/suits2022/suitsdb/suits.sqlite
    C:\Users\Geraldo\SUITS\TSS-Legacy\suits2022\express
    API PORT: 8080
    SOCKET PORT: 3001
    Checking database connection...
    Database connection OK!
    Starting Sequelize + Express example on port 8080...
    Express server started on port 8080. Try some routes, such as '/api/users'.
    ```
3. In a different terminal, run `curl localhost:8080/api/simulationcontrol/sim/1/start`
    * Your simulation should now be started, and you should be generating telemetry data

## Starting the Websockets Server

1. To start the Websockets server to communicate with your VISION Kit, run `node sockets/server.js`
    * Your Websockets server should now be running

2. Power up your VISION Kit
    * If you haven't already, be sure to change the host URL in your VISION Kit.
    * If everything is connected correctly, you will begin generating data from your VISION Kit, and it will be sent to the server.

3. To test if you are receiving data correctly, run `node sockets/clients/test_client.js`
    * You should see the full JSON chunk being generated.