const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const crypto = require('node:crypto');

async function registerUser(req, res) {

	//Debug console.log(req.body);
	if(req.body.username === undefined || req.body.username === '') {
		res.status(400).json({ ok: false, err: 'Username is missing or empty' });
		return;
	}

	if(req.body.room === undefined || req.body.room > 24) {
		res.status(400).json({ ok: false, err: 'Room ID is missing or out of range'});
		return;
	}

	req.body.guid = crypto.randomUUID();

	//Debug console.log(req.body);
	const user = await models.user.create(req.body);
	res.status(200).json(user);
};

async function update(req, res) {

    await models.user.update(req.body, {
        where: {
            id: id
        }
    });
    res.status(200).end();
}

module.exports = {
	registerUser
};
