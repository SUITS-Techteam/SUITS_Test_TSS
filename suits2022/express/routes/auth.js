const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function registerUser(req, res) {

    console.log(req.body);
    if(req.body.username === undefined || req.body.username === '') {
        res.status(400).json({ ok: false, err: 'Username is missing or empty' });
    }

    if(req.body.room === undefined || req.body.room > 24) {
        res.status(400).json({ ok: false, err: 'Room ID is missing or out of range'});
    }

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
