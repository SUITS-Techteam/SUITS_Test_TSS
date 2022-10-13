# SUITS TSS (Telemetry Stream Server) BOT 
## _WiP_  

This utility allows testing of the TSS in a multi-room / multi-tenant environment. As of this writing, the BOT creates 10 unique users
assigned to individual (fixed) rooms. Only 2 rooms have their EVA state stream enabled. 

__Terms__  
1. TS: Test Subject 
2. TC: Test Conductor 

### Workflow
1. Purge the DB and reload with all new data.
>**Note: This is a volitile action and will clear the DB! Back up the DB if you want to keep persisted data.**
2. Create TS users
3. Create TC user
4. Generate init GPS loc for each user
5. Start loop to generate and update GPS location
6. Start TC room EVA stream on the TSS
7. TS assigned to TC room above, starts listening for EVA stream data
8. TC switches to room
9. TC starts room EVA stream on the TSS
10. TS assigned to room 2 starts listening.
11. TS EVA stream- first few records are printed in the cnsl.

### Setting Up
1. Make sure the TSS is setup and fully operational. You should follow the README in the "suits2022" root directory if not.
2. Change directory to suits2022/bot
``` bash
$ cd ./bot
``` 
3. Install the NPM components 
``` bash
$ npm i
```
4. Open a new terminal window, navigate to the suits2022 root and start the TSS. (Follow the guide in the suits2022 README)
5. Go back to the bot terminal window and start the BOT:
``` bash
$ node run.js
```

### Files  
1. config.json: defines certain constants that can change the timing of data acquisition or events. 
2. data_events.json: Object that contains the commands for TS and TC users.   
3. run.js: Main entry point and execution of the bot.  
4. spawner.js: Generator for new users.  

### Know Issues
__1. TSS Stops Sending State Data__
__Problem:__ The TSS stops sending state data after starting and stopping the bot a few times.   
__Possible Issue:__  The TSS received a "start" command while still running and threw and error.   
__Solution:__ Stop the bot (ctl+c) then stop the TSS. Restart the system in the order of TSS then BOT. 