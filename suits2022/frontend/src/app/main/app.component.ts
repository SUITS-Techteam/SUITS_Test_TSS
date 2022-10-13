// Attributions
// <div>Icons made by <a href="https://www.flaticon.com/authors/bomsymbols" title="BomSymbols">BomSymbols</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

//Imports list
import { Component, NgModule, OnInit, TemplateRef, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { trigger, transition, style, animate, state } from '@angular/animations';
// import { EMUService } from '../services/emu.service';
import { APIService } from '../services/api.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { resolveReflectiveProviders } from '@angular/core/src/di/reflective_provider';
import * as moment from 'moment';
// import { Socket } from 'ngx-socket-io';


//Variables
var interval_switch;
var global_num;

@Component({  
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ APIService ],
  animations: [
    trigger('heightGrow', [
        state('closed', style({
            height: 0,
        })),
        state('open', style({
            height: 482.2 
        })),
        transition('* => *', animate(500))
    ]),
  ]
})

export class AppComponent {

  title ='NASA SUITS 2022';
  telems: {};
  uias: {};
  // socket;
  configWin = 'closed';
  keepSettings = true;
  
  url =  'http://localhost:3000';
  url2 = 'https://suits-2021.herokuapp.com';

  rooms = [];
  clients = [];
  user = {
    registered: false,
    siid: '',
    name: 'commander',
    room: 1,
    roomName: 'alpha'
  };

  userFrm;
  uiaSubscriber;
  uiaSimInfo;
  simState; // Determine current operational state
  uiaData;
  uiaState;

  evaSimInfo = null;    // Basic info that tells us the sim was created
  evaSimState;          // Determine current operational state
  evaTelemSubscriber;   // Data subscriber for push events
  evaControlSubscriber; // Data subscriber for push events
  evaTelem;             // Telemetry Data
  evaControls;          // Control Data
  evaFailure;           // Failure Data
  simInterval;          // Sim Interval func

  connErr = "";         // Connection Error Message
  lastConnTime: any;    // Last Connection Time

  errs = ['o2_error', 'pump_error', 'power_error', 'fan_error'];

  constructor( private http: HttpClient, 
    // private emu: EMUService, 
    private api: APIService,
    private modalService: BsModalService, 
    // private socketService: Socket, 
    private cdr: ChangeDetectorRef ) {}

//*************************************UIA****************************************

//test
ngOnInit() {
  // this.startUiaSimulation();

  // Check if keepSettings and user exists in cache
  let ks = localStorage.getItem('keepsettings');

  if(ks !== null && ks !== undefined) {
    this.keepSettings = (ks === 'true')? true : false;
  }

  setInterval(() => {
    this.api.getServerConnection().then(result => {
      if(result.ok) {
        this.connErr = "";
        this.lastConnTime = moment(result.data.time).format("MM-DD-YYYY hh:mm:ss A");
      } else {
        this.connErr = "No Server Connection!"
      }
    });

    this.api.getUserRooms().then(result => {
      if(result.ok) {

        // order by room


        this.clients = this.groupBy(result.data, 'room');
      }
    });
  }, 5000);

  this.api.getRooms().then(result => {
    this.rooms = result;

    console.log(this.rooms);
  }).catch(ex => {
    console.warn(ex);
  });

  // Request / Subscribe to rooms
  // this.emu.sGetRooms();
  // this.emu.sReceiveRooms().subscribe(data => {
  //   this.rooms = data;
  //   this.cdr.detectChanges();
  // });

  // // Subscribe to clients
  // this.emu.sGetClients().subscribe(data => {
  //   this.clients = this.groupBy(data.clients, 'room');
  // });

  let user = localStorage.getItem('user');

  if(this.keepSettings && user !== null) {
    console.log('Recalling User Settings');
    this.user = JSON.parse(user);

    // Pre-connect
    this.register();
  }

  // Verify that a registered user already exists!
  this.api.getUserByName(this.user.name).then(user => {
    if(!user || user.length === 0) {
      this.user.registered = false;
    } else {
      console.log(user[0]);
      this.user['id'] = user[0].id;
      this.user.registered = true;
    }
  }).catch(ex => {
    console.warn(ex);
  })

}

ngAfterViewInit() {
  setInterval(() => {
    // this.emu.sRequestClients();
  }, 3000);
}

setKeepSetting() {
  // store value in string format
  localStorage.setItem('keepsettings', (this.keepSettings)? 'true': 'false');
}

// We don't want to do this, or we will lose connection with the socket.
refresh() {
  location.reload()
}

toggleConfig() {
  (this.configWin == "closed") ? this.configWin = "open" : this.configWin = "closed";
}

updateUser() {
  console.log(this.user);
  // Check if user exists first
  this.api.getUserByName(this.user.name).then(result => {    
    if(result.length > 0) {
      // User exists, update
      this.api.updateUser(this.user).then(res => {
        console.log(res);
      });      
    } else {
      // User does not exist, create
      this.api.registerUser(this.user.name, this.user.room);
    }

  });
  // this.api.registerUser(this.user.name, this.user.room).then(result => {
  //   if(result.ok) {
  //     console.log(result);
  //   }
  // });

  // this.user = this.user;
  // this.cdr.detectChanges();
  // this.emu.sDisconnect();
  // this.emu.sConnect();

  // this.register();
}

register() {
  // this.emu.sRegister(this.user.name, this.user.room);
  // this.emu.sGetRegister().subscribe(data => {
  //   this.user = data;

  //   if(this.keepSettings) {
  //     localStorage.setItem('user', JSON.stringify(this.user));
  //   }

  //   this.createSim();
  // });
}

createSim() {
  // Enable the current SIM -- Do this only after the client has registered.
  // Enable UIA
  // this.emu.sEnableUiaSim( this.user.room );
  // this.emu.sUiaSimEnabled().subscribe(data => {
  //   this.uiaSimInfo = data;
  // });

  // // Enable EVA
  // this.emu.sEnableEvaSim( this.user.room );
  // this.emu.sEvaSimEnabled().subscribe(data => {
  //   console.log(this.evaSimInfo);
  //   this.evaSimInfo = data;
  //   this.cdr.detectChanges();
  //   console.log(this.evaSimInfo);
  // });
}

//STARTS THE UIA SIMULATION 
startUiaSimulation() {

  this.simState = 'start';
  // this.emu.sUIAToggle('start');

  // this.uiaSubscriber = this.emu.sUIAGetControls().subscribe(data => {
  //   this.uiaState = data;
  //   console.log(this.uiaState);
  // });

  // this.uiaSubscriber = this.emu.sUIAGetData().subscribe(data => {
  //   this.uiaData = data;
  //   console.log(this.uiaData);
  // });

  // this.http.post(url +'/api/simulation/uiastart',  {
  // })
  // .subscribe(data => {
  // console.log(data);
  // }); 
  // //updates data every 1 second
  // interval_switch = setInterval(() => { this.getUiaData() }, 1000);
  // console.log('server is running...');
}

//STOPS THE SERVER AND DATA STREAM
stopUiaSimulation() {
  this.simState = 'stop';
  // this.emu.sUIAToggle('stop');

  // Stop getting events
  this.uiaSubscriber.unsubscribe();

  // this.http.post(url + '/api/simulation/uiastop', {
  // })
  // .subscribe(data => {
  // console.log(data);
  // });
  // clearInterval(interval_switch );
  // console.log('uia has stopped');
}

pauseUiaSimulation() {
  this.simState = 'pause';
  // this.emu.sUIAToggle('pause');
}

  //SIMULATION IS PAUSED
//   pauseUiaSimulation(){
//     this.http.post(url + '/api/simulation/uiapause', {
//   })
//   .subscribe(data => {
//   console.log(data);
//   });
// }

resumeUiaSimulation() {
  this.simState = 'start';
  // this.emu.sUIAToggle('unpause');
}

//UiaSIMULATION IS RESUMED
// resumeUiaSimulation(){this.http.post(url + '/api/simulation/uiaunpause', {
// })
// .subscribe(data => {
// console.log(data);
// });
// }


//***********************************Telemetry*************************************
//STARTS THE SERVER AND DATA STREAM
  startSimulation() {

    if(this.evaSimState === 'pause') {
      this.resumeSimulation();

      return;
    }

    this.evaSimState = 'start';

    this.api.simControl(this.user.room, this.evaSimState).then(res => {
      if(!res.ok) {
        console.log(`An error ocurred starting the sim!`);
      } else {
        // If the sim start returns ok, let's get the data on interval
        this.simInterval = setInterval(() => {          
            this.getSimulationData();
        }, 1000);
      }
    });

  }

  //STOPS THE SERVER AND DATA STREAM AND REFRESHES THE PAGE 
  stopSimulation() {
    this.evaSimState = 'stop';

    this.api.simControl(this.user.room, this.evaSimState).then(res => {
      clearInterval(this.simInterval); // Clear the sim interval
      this.evaTelem = {}; // Clear the sim data
    });
    
    console.log('server has stopped');
  }

  //SIMULATION IS PAUSED
  pauseSimulation() {
    this.evaSimState = 'pause';
   
    this.api.simControl(this.user.room, this.evaSimState).then(res => {
      clearInterval(this.simInterval); // Clear the sim interval      
    });
}

//SIMULATION IS RESUMED
resumeSimulation() {
  this.evaSimState = 'unpause';

  this.api.simControl(this.user.room, this.evaSimState).then(res => {    
    this.evaSimState = 'start'; // Set state back to start
  });
  
  this.simInterval = setInterval(() => {
    this.getSimulationData();
  }, 1000);

}

// Get Eva Sim Data
getSimulationData() {
  if(this.connErr === '') {
    this.api.getEvaState(this.user.room).then(res => {
      console.log(res);
      this.evaTelem = res;
    }).catch(ex => {
      console.log(ex);
    });
  }
}

uiaActionControl(sensor, action) {
  // this.emu.sUIAControl(sensor, action);
  //   console.log(`${sensor} -> setting to ${action}`);
}


//DEPLOYS FAN ERROR
//SETS FAN ERROR VALUE TO TRUE, A FAN ERROR IS THEN DEPLOYED
//THE FAN SPEED BEGINS TO INCREASE. 

//********************************************************************** */
//Error function 

errFunc() {

  let num: number = Math.floor(Math.random() * 3) + 1;
  global_num = num;

  let err = this.errs[global_num];
  console.log("In err function number = " + num)
  
  // Send the error- let the server do the work
  // this.emu.sEvaError(err, true);

  return num;
}
//********************************************************************** */

//********************************************************************** */
//Resolve Error
resErr() {
  console.log("In resolve function number = " + global_num);

  let err = this.errs[global_num];
  // this.emu.sEvaError(err, false);
}
//********************************************************************** */

toggleControl(key, val) {
  this.api.simDCUCtl(this.user.room, key);
  // console.log(key, val);
  // this.emu.sEvaControl(key, val);
}

toggleError(errorKey, val) {
  this.api.simFailureCtl(this.user.room, errorKey);
}

fanError(){this.http.patch(
  this.url + '/api/simulation/deployerror?fan_error=true', {})
  .subscribe(data => {
    console.log(data);
  });
}

pumpError(){this.http.patch(
  this.url + '/api/simulation/deployerror?pump_error=true', {})
  .subscribe(data => {
    console.log(data);
  });
}

O2Error(){this.http.patch(
  this.url + '/api/simulation/deployerror?o2_error=true', {})
  .subscribe(data => {
    console.log(data);
  });
}

powerError(){
  this.http.patch(this.url + '/api/simulation/deployerror?power_error=true', {})
  .subscribe(data => {
    console.log(data);
  });
}

//RESOLVES FAN ERROR
//SETS FAN ERROR VALUE TO FALSE, FAN ERROR IS THEN RESOLVED
//THE FAN SPEED BEGINS TO DECREASE. 
resolveFanError(){this.http.patch(this.url + '/api/simulation/deployerror?fan_error=false', {
})
.subscribe(data => {
console.log(data);
});
}

resolvePumpError(){this.http.patch(this.url + '/api/simulation/deployerror?pump_error=false', {
})
.subscribe(data => {
console.log(data);
});
}

resolveO2Error(){this.http.patch(this.url + '/api/simulation/deployerror?o2_error=false', {
})
.subscribe(data => {
console.log(data);
});
}

resolvePowerError(){this.http.patch(this.url + '/api/simulation/deployerror?power_error=false', {
})
.subscribe(data => {
console.log(data);
});
}

//DEPLOYS FAN ERROR
setHandHold(val){this.http.patch(this.url + '/api/simulation/hand-hold?handhold=${val}`', {
})
.subscribe(data => {
  console.log(data);
});
}

//GETS DATA FOR STREAM FROM EMU.SERVICE.TS UNDER SERVICES 
//AN ARRAY OF UIA DATA IS CREATED, THIS DATA IS FED TO UIA FUNCTIONS 
getUiaData() {
  // this.emu.getUia()
  // .subscribe(data => {this.uias = data;
  //   this.uias = Array.of(this.uias);
  //   console.log(this.uias)
  // });
}

//GETS DATA FOR STREAM FROM EMU.SERVICE.TS UNDER SERVICES
//AN ARRAY OF EMU DATA IS CREATED, THIS DATA IS FED TO EMU FUNCTIONS
  getData() {
    // this.emu.getEMU()
    // .subscribe(data => {this.telems = data;
    //   this.telems = Array.of(this.telems);
    //   console.log(this.telems)
    // });
  }

  groupBy(xs, key) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
}
