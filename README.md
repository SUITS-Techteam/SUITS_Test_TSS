# SUITS Telemetry Server
The TSS is the core of the SUITS competition. It handles the various rooms, simulations, and just about everything else when the competition is running. It hosts a RESTful server with endpoints for adding teams, starting simulations, and much more. This repo also contains a web socket server. This is what HMDs will communicate with to receive telemetry data.

Keep in mind this is not the final version of the TSS.

This repo is made available to competing teams to allow them to test their HMDs.

To set it up and use it, read the quickstart below.

# Getting Started

## Required Software
1. [NodeJS](https://nodejs.org/en/) (LTS): at the time of writing this is 18.14.1

## Optional Software 
1. [Postman](https://www.postman.com/) : Used to test RESTful enpoints.

## Download -or- Clone the Telemetry Server
``` bash
$ git clone https://github.com/SUITS-Techteam/SUITS_Test_TSS.git
```

## Quickstart
1. Navigate into the root of the repository
2. Open a window of whatever terminal you'll be using ()
3. Install dependencies by running

    ``` bash
    npm i
    ```
4. Set up the database by running the following:
    ``` bash
    node sqlite-example-database/setup.js
    ```
5. Start the REST server by running:
    ``` bash
    node index.js
    ```
6. In another terminal, start the simulation through an http GET request:
    ``` bash
    curl http://localhost:8080/api/simulationcontrol/sim/1/start
    ```
7. Start the websocket server by running the following:
    ``` bash
    node sockets/server.js
    ```
8. Power up your VISION Kit
    * If you haven't already, be sure to change the host URL in your VISION Kit (see [VISION Kit Setup](#vision-kit-setup) below).  
    * If everything is connected correctly, you will begin generating data from your VISION Kit, and it will be sent to the server.

## VISION Kit Setup
Once you have your test environment set up and you server host established you will need to go into your VK and change the SUITS_TSSHOST to 
your server host IP. 

1. Connect a monitor and keyboard to your VK. 
2. Once the system is running and you have a prompt, you must connect the VK to the wifi network you'll run the test server on. Start by entering the following command:
    ``` bash
    sudo raspi-config
    ```
    Navigate to `Network Options` with the arrow keys and press enter
    
    Select `Wi-Fi` and follow the steps to add your ssid and password
    
    Select finish to close raspi-config

3. Next you need to update the SUITS_TSSHOST file on the vision kit. Enter the following commands:
    ``` bash
    cd TSS_Client
    nano .env
    ```
    Then add your server host IP address to the right side of `SUITS_TSSHOST=`.
    
    Press Ctrl + o to save then Ctrl + x to exit

4. Now restart your VK by running:
    ``` bash
    sudo reboot
    ```
    If your server is running and your SUITS_TSSHOST address is correct your VK should automatically start sending GPS data to the server!