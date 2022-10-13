/*
 * Spawner Class
 */

const axios = require('axios');

class Spawner {

    UTYPE = [
        "TS",
        "TC",
        "LS"
    ];    

    apiUrl;

    constructor(_apiUrl) { 
        this.apiUrl = _apiUrl;
    }

    connect(username, room, cb) {        
        axios.post(`${this.apiUrl}/api/auth/register`, { "username": username, "room": room })
          .then(function (response) {              
            return cb(null, response);
          })
          .catch(function (error) {
            return cb(error, null);
          });
    }
}

module.exports = Spawner;