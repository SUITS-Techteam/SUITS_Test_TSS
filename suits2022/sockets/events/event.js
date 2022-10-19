class Event {

    event;
    payload;

    constructor(data) {
        if(data.event) {
            this.event = data.event;
            this.payload = data.payload;
        }
    }

    stringifyMessage() {
        let msg = { 
            event: this.event, 
            payload: this.payload 
        };

        // console.log(msg);
        return JSON.stringify(msg);
    }

}

module.exports = Event;