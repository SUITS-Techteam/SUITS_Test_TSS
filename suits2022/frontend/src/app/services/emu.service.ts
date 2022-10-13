import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DEFAULT_VALUE_ACCESSOR } from '@angular/forms/src/directives/default_value_accessor';
import { getValueInRange } from '@ng-bootstrap/ng-bootstrap/util/util';
import { Socket } from 'ngx-socket-io';
import { map, retryWhen } from 'rxjs/operators';
import { Observable } from 'rxjs';

const url: string = 'http://localhost:8080';
const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class EMUService {
    
    constructor(private http: HttpClient, private socket: Socket) { }


    getEMU() {
        return this
                .http
                .get(url+'/api/simulation/state'); 
            }

    getUia() {
        return this
        .http
        .get(url+'/api/simulation/uiastate'); 
    }

    // Socket Commands
    sRegister(name, room) {
        this.socket.emit('register', {name, room});
    }

    sGetRegister(): Observable<any> {
        console.log('Getting something');
        return this.socket.fromEvent('register').pipe(map((data) => data));
    }

    sDisconnect() {
        this.socket.disconnect();
    }

    sConnect() {
        this.socket.connect();
    }

    sGetRooms() {
        this.socket.emit('getrooms');
    }

    sReceiveRooms(): Observable<any> {
        return this.socket.fromEvent('getrooms').pipe(map((data) => data));
    }

    sRequestClients() {
        this.socket.emit('getclients');
    }

    sGetClients(): Observable<any> {
        return this.socket.fromEvent('getclients').pipe(map((data) => data));
    }

    // UIA SIM EVENTS
    sEnableUiaSim(room) {
        this.socket.emit('uiasim', { room });
    }

    sUiaSimEnabled(): Observable<any> {
        return this.socket.fromEvent('uiasim').pipe(map((data) => data));
    }

    sUIAToggle(event) {
        this.socket.emit('uiatoggle', { event });
    }

    sUIAGetData(): Observable<any> {
        return this.socket.fromEvent('uiadata').pipe(map((data) => data));
    }

    sUIAGetControls(): Observable<any> {
        return this.socket.fromEvent('uiacontrols').pipe(map((data) => data));
    }

    sUIAControl(target, enable) {
        this.socket.emit('uiacontrol', { target, enable });
    }
    // END UIA SIM EVENTS

    // EVA SIM EVENTS
    sEnableEvaSim(room) {
        this.socket.emit('evasim', { room });
    }

    sEvaSimEnabled(): Observable<any> {
        return this.socket.fromEvent('evasim').pipe(map((data) => data));
    }

    sEvaToggle(event) {
        this.socket.emit('evatoggle', { event });
    }

    sEVAGetData(): Observable<any> {
        return this.socket.fromEvent('evadata').pipe(map((data) => data));
    }

    sEvaError(key, val) {
        this.socket.emit('evaerror', {key, val});
    }

    sEvaControl(key, val) {
        this.socket.emit('evacontrol', {key, val});
    }
    // END EVA SIM EVENTS

    sGenericEmit(listener, data) {
        this.socket.emit(listener, data);
    }
}