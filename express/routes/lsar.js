const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const lsars = await models.lsar.findAll();
	res.status(200).json(lsars);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const lsar = await models.lsar.findByPk(id);
	if (lsar) {
		res.status(200).json(lsar);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByRoomId(req, res) {	
	const lsar = await models.lsar.findAll({ where: { room: req.params.room }});
	if (lsar) {
		res.status(200).json(lsar);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByUserId(req, res) {	
	const lsar = await models.lsar.findAll({ where: { user: req.params.user }});
	if (lsar) {
		res.status(200).json(lsar);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		let lsar = await models.lsar.create(req.body);		
		res.status(201).send(lsar.dataValues);
	}
};

async function updateUser(req, res) {	
    await models.lsar.update(req.params.user, {
        where: {
            user: req.params.user
        }
    });
    res.status(200).end();
};

async function update(req, res) {
	let lsar = await models.lsar.update(req.body, {
		where: {
			id: req.params.id
		}
	});
	console.log(lsar);
	res.status(200).send({ok: true});
};

async function remove(req, res) {
	const id = getIdParam(req);
	await models.lsar.destroy({
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
