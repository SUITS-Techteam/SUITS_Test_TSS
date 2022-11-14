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

	//store in db, return db_id for message
  async parseMessageIMU(data) {
    let obj = JSON.parse(data.toString());
		const imumsg = await models.imumsg.create(obj);

    return imumsg;
  }

	//store in db, return db_id for message
  async parseMessageGPS(data) {
    let obj = JSON.parse(data.toString());
		const gpsmsg = await models.gpsmsg.create(obj);

    return gpsmsg;
  }
}

module.exports = Parser;
