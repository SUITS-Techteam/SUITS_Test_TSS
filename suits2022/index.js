const dotenv = require('dotenv').config();
const app = require('./express/app');
const sequelize = require('./sequelize');

const API_PORT = process.env.API_PORT;
const SOCKET_PORT = process.env.SOCKET_PORT;

console.log(`API PORT: ${API_PORT}`);
console.log(`SOCKET PORT: ${SOCKET_PORT}`);


async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!');
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk();

	console.log(`Starting Sequelize + Express example on port ${API_PORT}...`);

	app.listen(API_PORT, () => {
		console.log(`Express server started on port ${API_PORT}. Try some routes, such as '/api/users'.`);
	});
}

init();
