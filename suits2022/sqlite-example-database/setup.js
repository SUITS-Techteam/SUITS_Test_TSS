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
		{
      id: 1,
      username: 'faiz',
      room: 10,
      guid: 'ef0110ad-cd77-413d-af5e-88cd4091f50c',
      visionkit: 'VK01',
      hmd: 'HMD01'
    },
		{
      id: 2,
      username: 'faiz2',
      room: 11,
      guid: 'a429f7b1-882a-4642-901b-f859687f8292',
      visionkit: 'VK02',
      hmd: 'HMD02'
    },
		// { username: 'jack-sparrow' },
		// { username: 'white-beard' },
		// { username: 'black-beard' },
		// { username: 'brown-beard' },
	]);

	await sequelize.models.lsar.bulkCreate([

	]);

	await sequelize.models.imumsg.bulkCreate([

	]);

	await sequelize.models.gpsmsg.bulkCreate([

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
