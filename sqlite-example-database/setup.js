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
	];

	await sequelize.sync({ force: true });

	await sequelize.models.user.bulkCreate([
		{
      id: 1,
      username: 'faiz',
      room: 10,
      guid: 'ef0110ad-cd77-413d-af5e-88cd4091f50c',
    },
		{
      id: 2,
      username: 'faiz2',
      room: 11,
      guid: 'a429f7b1-882a-4642-901b-f859687f8292',
    }
		// { username: 'jack-sparrow' },
		// { username: 'white-beard' },
		// { username: 'black-beard' },
		// { username: 'brown-beard' },
	]);

	await sequelize.models.devices.bulkCreate([
		{
      name: 'VK01',
      description: 'Student Kit',
      guid: 'ef0110ad-cd77-413d-af5e-88cd4091f50c',
      type: 'VK',
			macaddress: 'B7-02-BC-4A-E2-61'
    },
		{
      name: 'VK02',
      description: 'Student Kit',
      guid: 'a429f7b1-882a-4642-901b-f859687f8292',
      type: 'VK',
			macaddress: '8E-95-15-2A-A9-E0'
    },
		{
      name: 'VK03',
      description: 'Student Kit',
      guid: null,
      type: 'VK',
			macaddress: 'F4-AF-1B-86-E5-AC'
    },
		{
      name: 'VK04',
      description: 'Student Kit',
      guid: null,
      type: 'VK',
			macaddress: '51-C2-CC-74-73-D7'
    },
		{
      name: 'VK05',
      description: 'Student Kit',
      guid: null,
      type: 'VK',
			macaddress: '5A-F9-2F-21-C0-8E'
    },
		{
      name: 'HMD01',
      description: 'Student Kit',
      guid: 'ef0110ad-cd77-413d-af5e-88cd4091f50c',
      type: 'HMD',
			macaddress: '1F-4E-B3-1A-9D-05'
    },
		{
      name: 'HMD02',
      description: 'Student Kit',
      guid: 'a429f7b1-882a-4642-901b-f859687f8292',
      type: 'HMD',
			macaddress: 'A7-DB-C5-CA-B4-69'
    },
		{
      name: 'HMD03',
      description: 'Student Kit',
      guid: null,
      type: 'HMD',
			macaddress: 'CC-49-F8-98-CE-D7'
    },
		{
      name: 'HMD04',
      description: 'Student Kit',
      guid: null,
      type: 'HMD',
			macaddress: 'C8-E2-26-01-EB-48'
    },
		{
      name: 'HMD05',
      description: 'Student Kit',
      guid: null,
      type: 'HMD',
			macaddress: '4B-9B-39-86-47-43'
    },
		{
      name: 'EVA01',
      description: 'Student Kit',
      guid: 'ef0110ad-cd77-413d-af5e-88cd4091f50c',
      type: 'EVA',
			macaddress: '6F-06-95-BB-22-63'
    }

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
