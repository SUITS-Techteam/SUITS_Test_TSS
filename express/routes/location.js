const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const locations = await models.location.findAll();
	res.status(200).json(locations);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const location = await models.location.findByPk(id);
	if (location) {
		res.status(200).json(location);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByRoomId(req, res) {
	const location = await models.location.findAll({ where: { room: req.params.room }});
	if (location) {
		res.status(200).json(location);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByUserId(req, res) {
	const location = await models.location.findAll({ where: { user: req.params.user }});
	if (location) {
		res.status(200).json(location);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`);
	} else {
		let location = await models.location.create(req.body);
		res.status(201).send(location.dataValues);
	}
};

async function updateUser(req, res) {
    await models.location.update(req.params.user, {
        where: {
            user: req.params.user
        }
    });
    res.status(200).end();
};

async function update(req, res) {
	let location = await models.location.update(req.body, {
		where: {
			id: req.params.id
		}
	});
	console.log(location);
	res.status(200).send({ok: true});
};

async function remove(req, res) {
	const id = getIdParam(req);
	await models.location.destroy({
		where: {
			id: id
		}
	});

	res.status(200).end();
};

module.exports = {
	getAll,
	getById,
    getByRoomId,
    getByUserId,
	create,
	update,
    updateUser,
	remove,
};
