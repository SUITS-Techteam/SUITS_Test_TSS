const sequelize = require('../sequelize');
// const { pickRandom, randomDate } = require('./helpers/random');

async function reset() {
	console.log('Will rewrite the SQLite example database, adding some dummy data.');

	let roomList = [
		{ name: 'alpha' },
		{ name: 'beta' },
		{ name: 'gamma' },
		{ name: 'delta' },
		{ name: 'eplsilon' },
		{ name: 'zeta' },
		{ name: 'eta' },
		{ name: 'theta' },
		{ name: 'iota' },
		{ name: 'kappa' },
		{ name: 'lambda' },
		{ name: 'mu' },
		{ name: 'nu' },
		{ name: 'xi' },
		{ name: 'omicron' },
		{ name: 'pi' },
		{ name: 'rho' },
		{ name: 'sigma' },
		{ name: 'tau' },
		{ name: 'upsilon' },
		{ name: 'phi' },
		{ name: 'chi' },
		{ name: 'psi' },
		{ name: 'omega' }
	]

	await sequelize.sync({ force: true });

	await sequelize.models.user.bulkCreate([
		// { username: 'jack-sparrow' },
		// { username: 'white-beard' },
		// { username: 'black-beard' },
		// { username: 'brown-beard' },
	]);

	await sequelize.models.lsar.bulkCreate([

	]);

	await sequelize.models.room.bulkCreate(roomList);

	// Create a new data set for each room	
	await roomList.forEach(async (room, idx) => {
		let simRow = { room: idx + 1 };
		await sequelize.models.simulationcontrol.create(simRow);
		await sequelize.models.simulationfailure.create(simRow);
		await sequelize.models.simulationstate.create(simRow);
		await sequelize.models.simulationstateuia.create(simRow);
		await sequelize.models.simulationuia.create(simRow);
	});	

	await sequelize.models.role.bulkCreate([
		{ role: 'aruser' },
		{ role: 'lsaruser'},
		{ role: 'admin'}
	]);

	console.log('Done!');
}

reset();
