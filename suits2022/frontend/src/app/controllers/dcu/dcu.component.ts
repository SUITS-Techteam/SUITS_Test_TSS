
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const url = 'http://localhost:3000'
const url2 = 'https://suits-2021.herokuapp.com'

@Component({
	selector: 'dcu-root',
	templateUrl: './dcu.component.html',
	styleUrls: ['./dcu.component.scss'],
})
export class DCUComponent {
    constructor(private router: Router, private http: HttpClient){
    }

    public onClick(){
        this.router.navigate(['./uia']);
	}

	status: boolean = false;
	o2status: boolean = false;
	s3status: boolean = false;
	s4status: boolean = false;
	s5status: boolean = false;
    fanstatus: boolean = false;
    

    /* 
********************************* DCU CONTROLLER FUNCTION *******************************************
THESE FUNCTIONS CONTROL THE DCU TELEMETRY DATA THROUGH THE DCU ON SCREEN CONTROLLER. 
EACH FUNCTION SENDS PATCH UPDATES BACK TO THE TELEMETRY STREAM
THE TELEMETRY VALUES ARE MANIPULATED BY THE STATE (ON OR OFF) OF EACH FUNCTION. 
*/

    suitPower() {
        this.status = !this.status;
        if (!this.status){
            {this.http.patch(url+'/api/simulation/newcontrols?suit_power=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newcontrols?suit_power=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }
    o2Switch() {
        this.o2status = !this.o2status;
        if (!this.o2status){
            {this.http.patch(url+'/api/simulation/newcontrols?o2_switch=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newcontrols?o2_switch=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }

    switch3() {
        this.s3status = !this.s3status;
        if (!this.s3status){
            {this.http.patch(url+'/api/simulation/newcontrols?aux=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newcontrols?aux=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }

    switch4() {
        this.s4status = !this.s4status;
        if (!this.s4status){
            {this.http.patch(url+'/api/simulation/newcontrols?pump=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newcontrols?pump=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }

    switch5() {
        this.s5status = !this.s5status;
        if (!this.s5status){
            {this.http.patch(url+'/api/simulation/newcontrols?rca=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newcontrols?rca=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
	}
	
	fanSwitch() {
        this.fanstatus = !this.fanstatus;
        if (!this.fanstatus){
            {this.http.patch(url+'/api/simulation/newcontrols?fan_switch=false', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }
        }
        else{
            {this.http.patch(url+'/api/simulation/newcontrols?fan_switch=true', {
            })
            .subscribe(data => {
            console.log(data);
            });
            }

        }
    }
}
