class Parser {
    constructor() {}
    
    parseMessage(data, cb) {
        let obj = JSON.parse(data.toString());
        console.log(obj);
        // console.log(obj);
        // if( (obj.event !== 'connection' && !obj.id) && !obj.event && !obj.payload) {
        //     console.log(`ERR-PRSVAL`);
        //     return cb(`ERR-PRSVAL`, null);
        // }
        return cb(null, obj);
    }

}

module.exports = Parser;