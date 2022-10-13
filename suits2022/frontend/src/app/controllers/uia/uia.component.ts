
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EMUService } from '../../services/emu.service';

const url = 'http://localhost:3000'
const url2 = 'https://suits-2021.herokuapp.com'

@Component({
	selector: 'uia-root',
	templateUrl: './uia.component.html',
    styleUrls: ['./uia.component.scss'],
    providers: [EMUService]
    
})
export class UIAComponent {
    constructor(private router: Router, private http: HttpClient, private emuService: EMUService ){
    }

    public onClick(){
        this.router.navigate(['./uia']);
    }

    status1: boolean = false;
    status2: boolean = false; 
    supplystatus: boolean = false; 
    supply1status: boolean = false;
    waste1status: boolean =  false; 
    wastestatus: boolean = false; 
    oxstatus: boolean = false; 
    ox1status: boolean = false;
    pumpstatus: boolean = false;
    ventstatus: boolean = false;

    /* 
********************************* UIA CONTROLLER FUNCTION *******************************************
THESE FUNCTIONS CONTROL THE UIA TELEMETRY DATA THROUGH THE UIA ON SCREEN CONTROLLER. 
EACH FUNCTION SENDS PATCH UPDATES BACK TO THE TELEMETRY STREAM
THE TELEMETRY VALUES ARE MANIPULATED BY THE STATE (ON OR OFF) OF EACH FUNCTION. 
*/
    

    emuOnOff1() {
        this.status1 = !this.status1;
        this.emuService.sUIAControl('emu1', this.status1);
        
        // if (!this.status1) {
        //     { this.http.patch(url+'/api/simulation/newuiacontrols?emu1=false', {})
        //         .subscribe(data => {
        //             console.log(data);
        //         });
        //     }
        // } else {
        //     { this.http.patch(url+'/api/simulation/newuiacontrols?emu1=true', {})
        //         .subscribe(data => {
        //             console.log(data);
        //         });
        //     }

        // }
    }
    emuOnOff2() {
        this.status2 = !this.status2;
        if (!this.status2){
            {this.http.patch(url+'/api/simulation/newuiacontrols?emu2=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newuiacontrols?emu2=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }

    supplyWater1() {
        this.supply1status = !this.supply1status;
        if (!this.supply1status){
            {this.http.patch(url+'/api/simulation/newuiacontrols?ev1_supply=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newuiacontrols?ev1_supply=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }
    supplyWater2() {
        this.supplystatus = !this.supplystatus;
        if (!this.supplystatus){
            {this.http.patch(url+'/api/simulation/newuiacontrols?ev2_supply=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newuiacontrols?ev2_supply=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }

    wasteWater1() {
        this.waste1status = !this.waste1status;
        if (!this.waste1status){
            {this.http.patch(url+'/api/simulation/newuiacontrols?ev1_waste=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newuiacontrols?ev1_waste=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }
    wasteWater2() {
        this.wastestatus = !this.wastestatus;
        if (!this.wastestatus){
            {this.http.patch(url+'/api/simulation/newuiacontrols?ev2_waste=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newuiacontrols?ev2_waste=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }

    oxygen1() {
        this.ox1status = !this.ox1status;
        if (!this.ox1status){
            {this.http.patch(url+'/api/simulation/newuiacontrols?emu1_O2=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newuiacontrols?emu1_O2=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }
    oxygen2() {
        this.oxstatus = !this.oxstatus;
        if (!this.oxstatus){
            {this.http.patch(url+'/api/simulation/newuiacontrols?emu2_O2=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newuiacontrols?emu2_O2=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }

    o2Vent() {
        this.ventstatus = !this.ventstatus;
        if (!this.ventstatus){
            {this.http.patch(url+'/api/simulation/newuiacontrols?O2_vent=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newuiacontrols?O2_vent=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }
    depressPump() {
        this.pumpstatus = !this.pumpstatus;
        if (!this.pumpstatus){
            {this.http.patch(url+'/api/simulation/newuiacontrols?depress_pump=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newuiacontrols?depress_pump=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }
}