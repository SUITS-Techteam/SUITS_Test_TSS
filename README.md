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
    * If you haven't already, be sure to change the host URL in your VISION Kit (see VISION Kit Setup below).  
    * If everything is connected correctly, you will begin generating data from your VISION Kit, and it will be sent to the server.

3. To test if you are receiving data correctly, run `node sockets/clients/test_client.js`
    * You should see the full JSON chunk being generated.
    
## VISION Kit Setup

Once you have your test environment set up and you server host established you will need to go into your VK and change the SUITS_TSSHOST to 
your server host IP. 

1. You will need to connect a monitor and keyboard to your VK. 
2. You will need to enter your wifi credentials 
3. In order to update the SUITS_TSSHOST enter the following command: 
   ```
   cd TSS_Client
   nano .env
   ```
   Update the ```SUITS_TSSHOST=``` to your server host IP address. 
   Press Ctrl + o to save then Ctrl + x to exit
   
4. Now restart your VK. If your server is running and your SUITS_TSSHOST address is correct your VK should automatically start sending GPS data 
   to the server!

## THINGS TO NOTE
This is not the final version of the TSS, we are making changes to prepare for test week. The final version of the TSS will require you to register via your HMD. You will provid information like Team Name, University, etc. This version of the TSS is to get you the data you will be working with come test week. Feel free to ask any questions!
