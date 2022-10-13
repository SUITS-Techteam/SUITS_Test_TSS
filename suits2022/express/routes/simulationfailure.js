const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const simulationfailures = await models.simulationfailure.findAll();
	res.status(200).json(simulationfailures);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const simulationfailure = await models.simulationfailure.findByPk(id);
	if (simulationfailure) {
		res.status(200).json(simulationfailure);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByRoomId(req, res) {
	const id = req.params.room;
	const simulationfailure = await models.simulationfailure.findAll({where: {room: id}});
	if (simulationfailure) {
		res.status(200).json(simulationfailure);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.simulationfailure.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);
    await models.simulationfailure.update(req.body, {
        where: {
            id: id
        }
    });
    res.status(200).end();
};

async function remove(req, res) {
	const id = getIdParam(req);
	await models.simulationfailure.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
    getByRoomId
};
