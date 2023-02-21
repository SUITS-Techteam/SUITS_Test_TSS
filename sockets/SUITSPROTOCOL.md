## Clients (all):
-	connects to socket server
-	sends REGISTER msg with MACADDRESS and HARDWARETYPE
-	server assigns MACADDRESS for a HARDWARETYPE(VK,SIM, etc) for a given user/GUID which has a room assignment

## Server:
-	server collects data from MACADDRESSES on an interval
-	server then pushes data to a room by looking up the room associated with a MACADDRESS
-	server sends a DATA msg with ROOM and GUID/USER fields
-	if the MACADDRESS is unassigned, the server must reject the message

## Client( Visionkit):
-	connects to socket server
-	sends REGISTER msg with MACADDRESS and HARDWARETYPE
-	sends DATA msg with MACADDRESS and HARDWARETYPE

## Client( HMD):
-	connects to socket server
-	sends REGISTER msg with MACADDRESS and HARDWARETYPE
-	waits for DATA msgs to be pushed with ROOM and GUID/USER fields

## Client( EVASim ):
-	connects to socket server
-	sends REGISTER msg with MACADDRESS and HARDWARETYPE
-	sends DATA msg with MACADDRESS and HARDWARETYPE

## Client( Rover/Spectrometer):
-	connects to socket server
-	sends REGISTER msg with MACADDRESS and HARDWARETYPE
-	sends DATA msg with MACADDRESS and HARDWARETYPE
-	TBD
