import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DEFAULT_VALUE_ACCESSOR } from '@angular/forms/src/directives/default_value_accessor';
import { getValueInRange } from '@ng-bootstrap/ng-bootstrap/util/util';
import { map, retryWhen } from 'rxjs/operators';
import { Observable } from 'rxjs';

const url: string = 'http://localhost:8080';
const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class APIService {
    
    constructor(private http: HttpClient) { }

    getServerConnection(): Promise<any> {
        return this.http.get(`${url}/conntest`).toPromise().then(res => {
            return { ok: true, data: res };
        }).catch(ex => {
            return { ok: false, err: ex };
        });
    }

    getRooms(): Promise<any> {
        return this.http.get(`${url}/api/rooms`).toPromise().then(rooms => {
            return rooms;
        }).catch(ex => {
            return { ok: false, err: ex };
        });
    }

    getUserByName(username): Promise<any> {
        return this.http.get(`${url}/api/users/user/${username}`).toPromise().then(user => {
            return user;
        }).catch(ex => {
            return { ok: false, err: ex };
        });
    }

    registerUser(username, room): Promise<any> {
        return this.http.post(`${url}/api/auth/register`, {username, room})
        .toPromise().then(user => {
            return user;
        }).catch(ex => {
            return { ok: false, err: ex };
        })
    }

    updateUser(user): Promise<any> {
        return this.http.put(`${url}/api/users/${user.id}`, user)
        .toPromise().then(user => {
            return user;
        }).catch(ex => {
            return { ok: false, err: ex };
        })
    }

    getUserRooms(): Promise<any> {
        return this.http.get(`${url}/api/rooms/cmdr/getusers`)
        .toPromise().then(users => {
            return { ok: true, data: users};
        }).catch(ex => {
            return { ok: false, err: ex };
        });
    }

    //********SIM CONTROLS********//

    simControl(room, command): Promise<any> {
        return this.http.get(`${url}/api/simulationcontrol/sim/${room}/${command}`)
        .toPromise().then(result => {
            return result;
        }).catch(ex => {
            return { ok: false, err: ex };
        });
    }

    simDCUCtl(room, command): Promise<any> {
        return this.http.get(`${url}/api/simulationcontrol/simctl/${room}/${command}`)
        .toPromise().then(result => {
            return result;
        }).catch(ex => {
            return { ok: false, err: ex };
        });
    }

    simFailureCtl(room, failure): Promise<any> {
        return this.http.get(`${url}/api/simulationcontrol/simfail/${room}/${failure}`)
        .toPromise().then(result => {
            return result;
        }).catch(ex => {
            return { ok: false, err: ex };
        });
    }

    getEvaState(room): Promise<any> {
        return this.http.get(`${url}/api/simulationstate/room/${room}`)
        .toPromise().then(result => {
            return result[0];
        }).catch(ex => {
            return { ok: false, err: ex };
        });
    }

    //******END SIM CONTROLS******//


}