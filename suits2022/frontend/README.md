# EMU-Telemetry

### SASS Errors
I noticed that there is some issue with SASS especially if you are running Node LTS (16.x). 
Take a look at the SASS table to ensure the proper version is being installed. You can find it here [node-sass](https://www.npmjs.com/package/node-sass)

The easiest way to fix this issue is to run the following:
```bash
$ npm un node-sass
$ npm i -D sass
```
Seems to compile just fine and matches up the correct version required.