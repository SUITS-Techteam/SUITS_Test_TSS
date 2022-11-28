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

  async parseMessageIMU(obj, models) {
		for(const elem in obj)
			if(elem === "id")
				delete obj[elem];
		  else
				obj[elem] = parseFloat(obj[elem]);

		const imumsg = await models.imumsg.create(obj);

    return imumsg;
  }

  async parseMessageGPS(obj, models) {
		const gpsmsg = await models.gpsmsg.create(obj);

    return gpsmsg;
  }
}

module.exports = Parser;
