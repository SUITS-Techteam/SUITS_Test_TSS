const axios = require('axios');
const Table = require('cli-table');

class DataEvents {
    currentUser;
    apiUrl;
    // Defines the friendly name for each room if needed.
    ROOMNAMES = [ 'alpha', 'beta', 'gamma', 'delta', 'eplsilon',
		'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda',
		'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma',
		'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega'];

    constructor(_user, _apiUrl) { 
        this.currentUser = _user;
        this.apiUrl = _apiUrl;
    }

    LocationSet(cb) {
        axios.post(`${this.apiUrl}/api/locations`, 
            { "user":      this.currentUser.id, 
              "room":      this.currentUser.room, 
              "latitude":  this.currentUser.pos.lat, 
              "longitude": this.currentUser.pos.lon })
          .then((response) => {
              this.currentUser.loc_id = response.data.id;
            return cb(null, response);
          })
          .catch(function (error) {
              console.log(error);
            return cb(error, null);
        });
    }

    locationUpdate(lat, lon, cb) {
        this.currentUser.pos.lat = lat;
        this.currentUser.pos.lon = lon;
        axios.put(`${this.apiUrl}/api/locations/${this.currentUser.loc_id}`, 
            { "user":      this.currentUser.id, 
              "room":      this.currentUser.room, 
              "latitude":  lat, 
              "longitude": lon })
          .then(function (response) {
            return cb(null, response);
          })
          .catch(function (error) {
              console.log(error);
            return cb(error, null);
        });
    }

    LocationGet() {

    }

    TelemetryGet(cb) {
        axios.get(`${this.apiUrl}/api/simulationstate/${this.currentUser.room}`)
            .then(res => {
                let table = new Table({
                    head: ['User', 'Room', 'glat', 'glon', 'Running', 'Time', 'Heart']
                });

                table.push(
                    [this.currentUser.username, 
                     this.currentUser.room, 
                     this.currentUser.pos.lat, 
                     this.currentUser.pos.lon,
                     res.data.isRunning,
                     res.data.time,
                     res.data.heart_bpm]
                );

                console.log(table.toString());

                return cb(null, res.data);
            }).catch(ex => {
                return cb(ex, null);
        });
    }

    LSARGet() {

    }

    UpdateUserRoom(room, cb) {
        axios.put(`${this.apiUrl}/api/users/${this.currentUser.id}`, {room: room})
        .then(res => {
            console.log(res.data);
            return cb(null, res.data);
        }).catch(ex => {
            return cb(ex, null);
    });
    }

    ToggleEVA(room, event, cb) {
        axios.get(`${this.apiUrl}/api/simulationcontrol/sim/${room}/${event}`)
            .then(res => {
                return cb(null, res.data);
            }).catch(ex => {
                return cb(ex, null);
        });
    }
}

module.exports = DataEvents;