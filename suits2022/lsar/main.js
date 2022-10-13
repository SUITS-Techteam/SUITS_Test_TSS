/************************************************* 
 * LunarSAR Participant Location Tool
 * /lsar/index.html
 * 
 * Author: Nick Davis [Metecs]: nicholas.r.davis@nasa.gov
 * 
 * Desc: This is a simple tool that allows a LunarSAR partcipant to 
 *  register and record their location- so that the AR participant
 *  can calculate the proper heading and bearing to the downed 
 *  crew member.
 * 
 * Requirements:
 *  1. Connection to the SUITS Telemetry Server
 *  2. A device with a modern browser
 *  3. Ability to accept the "Know your location" option in the browser.
 * 
 * Operation: 
 *  1. The LunarSAR participant accesses the page on their device.
 *  2. The participant is prompted with a message "The page wants to: Know your location". The participant accepts.
 *  3. The location is best guessed by either network switch of device GPS.
 *  4. The user must create a unique username and select the room they want to send data to.
 *      4.a. If the user changes their name or room, they must click "Update User Info" each time.
 *  5. Since the location is best guess, the particpant can "adjust" their location by:
 *      5.a. Using the map and moving the red map pin to the location.
 *      5.b. Or by entering the coordinates directly into the form.
 * 
 * Notes:
 *  1. The API URL is a local variable that determines the endpoint to the API route.
 *      1.a. Note that the URL should always have a trailing "/"
 *      1.b. No path joins are being used, so the API URL is purely concatenated. 
 *  2. A connection to the server is made as soon as the page is accessed.
 *      2.a. To verify a connection, the "Room" list will be populated with data.
 *      2.b. If no room data is present, the connection was not successful.
 *  3. A user must be registed before any data will be sent to the server.
 *      3.a. Always check your room value following an update. That will be room you are sending data to.  
 * 
 * Resources:
 *  1. Bing Key:
 *      1.a. Au51iyab6y1RrBz0YeUQMDrc85NC22YR25ofO-xJ1mpep6yxnzF6MHfsFG_1zcCK
*/
    
    
    var map;
    var redPin;
    var userPos;
    var LSARCoords = {
        latitude: 0,
        longitude: 0,
        altitude: 0,
        speed: 0,
        heading: 0
    }
    var LSARUser = {
        username: 'LSAR' + Math.floor(Math.random() * (10000 - 999 + 1) + 9999),
        room: 1
    }

    var defCoords = {
        latitude: 29.5650733,
        longitude: -95.0810974
    }

    var apiUrl = "http://localhost:8080/api/";
    function GetMap() {
        map = new Microsoft.Maps.Map('#myMap', {
            mapTypeId: Microsoft.Maps.MapTypeId.canvasDark
        });

        // Set LSAR common location
        // var lsarCommon = new Microsoft.Maps.Polygon([
        //     new Microsoft.Maps.Location(center.latitude - 0.05, center.longitude - 0.05),
        //     new Microsoft.Maps.Location(center.latitude + 0.01, center.longitude - 0.05),
        //     new Microsoft.Maps.Location(center.latitude + 0.01, center.longitude + 0.05)], { fillColor: 'yellow', strokeColor: 'orange', strokeThickness: 5, strokeDashArray: [1, 2, 5, 10] });
        // map.entities.push(lsarCommon);

        //Add a standard red pushpin that doesn't have dragging enabled.        
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                userPos = position;                
                
                redPin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(userPos.coords.latitude, userPos.coords.longitude), { color: '#f00', draggable: true });
                map.entities.push(redPin);

                LSARCoords.latitude = userPos.coords.latitude;
                LSARCoords.longitude = userPos.coords.longitude;
                LSARCoords.altitude = userPos.coords.altitude;
                LSARCoords.speed = userPos.coords.speed;
                LSARCoords.heading = userPos.coords.heading;

                Microsoft.Maps.Events.addHandler(redPin, 'drag', function (e) { highlight('pushpinDrag', e); });
                Microsoft.Maps.Events.addHandler(redPin, 'dragend', function (e) { highlight('pushpinDragEnd', e); });
                Microsoft.Maps.Events.addHandler(redPin, 'dragstart', function (e) { highlight('pushpinDragStart', e); });

                updateFormValues();

                var positionInfo = "Your current position is " + JSON.stringify(LSARCoords);
                document.getElementById("result").innerHTML = positionInfo;
            });
        } else {
            alert("Sorry, your browser does not support HTML5 geolocation.");
        }          
    }

    function LocationWriteLocal() {
        
    }

    function LocationGetLocal() {

    }

    function updateFormValues() {
        $('#latitude').val(LSARCoords.latitude);
        $('#longitude').val(LSARCoords.longitude);
        $('#altitude').val(LSARCoords.altitude);
        $('#heading').val(LSARCoords.heading);

        $('#sendLoc').show();
    }

    function highlight(id, event) {                        
        LSARCoords.latitude = event.target.getLocation().latitude;
        LSARCoords.longitude = event.target.getLocation().longitude;
        LSARCoords.altitude = event.target.getLocation().altitude;

        document.getElementById("result").innerHTML = "Position Changed To: " + JSON.stringify(LSARCoords);

        updateFormValues();

        // $.ajax({
        //     url: 'ajaxfile.php',
        //     type: 'post',
        //     data: {name:'yogesh',salary: 35000,email: 'yogesh@makitweb.com'},
        //     success: function(response) {
        //         document.getElementById("message"),innerHTML = "LSAR Position Updated to server"
        //     }
        // });
    }        

    function createFontPushpin(location, text, fontName, fontSizePx, color) {
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');

        //Define font style
        var font = fontSizePx + 'px ' + fontName;
        ctx.font = font

        //Resize canvas based on sie of text.
        var size = ctx.measureText(text);
        c.width = size.width;
        c.height = fontSizePx;

        //Reset font as it will be cleared by the resize.
        ctx.font = font;
        ctx.textBaseline = 'top';
        ctx.fillStyle = color;

        ctx.fillText(text, 0, 0);

        return new Microsoft.Maps.Pushpin(location, {
            icon: c.toDataURL(),
            anchor: new Microsoft.Maps.Point(c.width / 2, c.height / 2) //Align center of pushpin with location.
        });
    }    

    /****************************************** 
    * AJAX EVENTS
    *******************************************/

    function UpdatePostion() {
        if(!LSARCoords.id) {
            LSARCoords.user = LSARUser.id;
            LSARCoords.room = LSARUser.room;
            $.ajax({
                url: apiUrl + 'locations',
                type: 'post',
                data: LSARCoords,
                success: (response) => {
                    LSARCoords = response;

                    $('#sendLoc').hide();
                }
            });
        } else {
            $.ajax({
                url: apiUrl + `locations/${LSARCoords.id}`,
                type: 'put',
                data: LSARCoords,
                success: (response) => {
                    if(response.ok) {
                        $('#sendLoc').hide();
                    }
                }
            });
        }
    }

    function sendLSARMsg() {
        let LSARMsg = {};
        LSARMsg.sender = LSARUser.id;
        LSARMsg.room = LSARUser.room;
        LSARMsg.time = new Moment(Date()).format('YYYY-MM-DD HH:mm:ss');
        LSARMsg.priority_tag = "HIGH";
        LSARMsg.encoded_lat = LSARCoords.latitude.toString();
        LSARMsg.encoded_lon = LSARCoords.longitude.toString();
        LSARMsg.pnt_source = "SURFACE";
        LSARMsg.condition_state = "BAD";
        LSARMsg.vmc_txt = "I Need assistance";
        LSARMsg.tac_sn = "0000111" + LSARUser.id;
        LSARMsg.cntry_code = "366";
        LSARMsg.homing_dvc_stat = "HOMING",
        LSARMsg.ret_lnk_stat = "YES",
        LSARMsg.test_proto = "NON-TEST",
        LSARMsg.vessel_id = "NA",
        LSARMsg.beacon_type = "010"

        $.ajax({
            url: apiUrl + 'lsar',
            type: 'post',
            data: LSARMsg,
            success: (response) => {
                alert(`LSAR Sent to Room: ${LSARUser.room}`);
            }
        });
    }

    function GetRooms() {
        $.ajax({
            url: apiUrl + 'rooms',
            type: 'get',
            success: function(response) {
                console.log(response);
                response.forEach(room => {
                    $('#roomList').append(`<option value="${room.id}">${room.id}: ${room.name}</option>`);
                });

                setTimeout(() => {
                    // $("#roomList select").val(LSARUser.room).change();
                    let opt = `option[value=${LSARUser.room}]`;
                    $('#roomList ' + opt).attr('selected','selected');
                    console.log('Set selected to' + LSARUser.room);
                }, 1000);
            }
        });
    }

    function registerUser() {
        if(!LSARUser.id) {
            $.ajax({
                url: apiUrl + 'auth/register',
                type: 'post',
                data: LSARUser,
                success: (response) => {
                    console.log(response);
                    LSARUser = response;
                    $('#sendLoc').show();
                    $('#updateUserWarn').hide();
                    $('#register').hide();
                    $('#registerMsg').show();
                }
            });
        } else {
            console.log(LSARUser);
            $.ajax({
                url: apiUrl + `users/${LSARUser.id}`,
                type: 'put',
                data: LSARUser,
                success: (response) => {
                    console.log(response);
                    $('#sendLoc').show();
                    $('#updateUserWarn').hide();
                    $('#register').hide();
                    $('#registerMsg').show();
                }
            });
        }

    }

    /****************************************** 
    * END AJAX EVENTS
    *******************************************/

    /****************************************** 
    * JQuery Events and Listeners
    *******************************************/
    $(document).ready(function() {
        let isStart = true;
        $('#registerMsg').hide();
        $("#url").val(apiUrl);
        $("#url").on("input", () => {
            // Print entered value in a div box
            apiUrl = $(this).val();
        });

        $('#username').val(LSARUser.username);

        GetRooms();
        if(!LSARUser.id) {

            $('#sendLoc').hide();
            $('#updateUserWarn').show();
            // registerUser();
        }

        $( "#roomList" ).change(() => {            
            $( "#roomList option:selected" ).each(() => {
                if(!isStart) {
                    let roomVal = $( '#roomList' ).val();
                    console.log("Room changing to: " + roomVal);
                    LSARUser.room = roomVal;
                    $('#register').show();
                }
                isStart = false;
            });            
        }).change();
    });