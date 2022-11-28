const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const crypto = require('node:crypto');

async function getUsers() {
	const userData = await models.user.findAll();
	return userData;
}
async function getVKs() {
	const vkData = await models.visionkit.findAll();
	return vkData;
}
async function getHMDs() {
	const hmdData = await models.hmd.findAll();
	return hmdData;
}

function getUnassignedVKs(vks) {
	let unassigned = [];
	//console.log(vk,vks)
	for(const vk in vks) {

		if( !vks[vk].assignment )
			unassigned.push(vks[vk]);
	}

	return unassigned;
}

async function registerUser(req, res) {

	//Debug console.log(req.body);

	if(req.body.username === undefined || req.body.username === '') {
		res.status(400).json({ ok: false, err: 'Username is missing or empty' });
		return;
	}

	let users;
	try {
		users = await getUsers();
	} catch (err) {
		console.log(err);
		res.status(400).json({ ok: false, err: "Could not get Users"});
		return;
	};

	for(const userRecord of users) {
		if(req.body.username === userRecord.username) {
			res.status(400).json({ ok: false, err: "User already exists"});
			return;
		}
	}

	//TODO check if room is full
	if(req.body.room === undefined || req.body.room > 24) {
		res.status(400).json({ ok: false, err: 'Room ID is missing or out of range'});
		return;
	}

	//TODO check if visionkit is assigned and if so make req.body.visionkit = assigned

	let vks;
	try {
		vks = await getVKs();
	} catch (err) {
		console.log(err);
		res.status(400).json({ ok: false, err: "Could not get VKs"});
		return;
	};

	let unassigned_vks = getUnassignedVKs(vks);
	let next_vk;

	if(unassigned_vks.length === 0) {
		res.status(400).json({ ok: false, err: "No more VKs to assign"});
		return;
	} else {
		next_vk = unassigned_vks[0];
		req.body.visionkit = next_vk.name;
	};


	let hmds;
	try {
		hmds = await getHMDs();
	} catch (err) {
		console.log(err);
		res.status(400).json({ ok: false, err: "Could not get HMDs"});
		return;
	};

	let unassigned_hmds = getUnassignedVKs(hmds);
	let next_hmd;

	if(unassigned_hmds.length === 0) {
		res.status(400).json({ ok: false, err: "No more HMDs to assign"});
		return;
	} else {
		next_hmd = unassigned_hmds[0];
		req.body.hmd = next_hmd.name;
	};

	req.body.guid = crypto.randomUUID();

	const user = await models.user.create(req.body);
	const vk = await next_vk.update({ assignment: req.body.guid });
	const hmd = await next_hmd.update({ assignment: req.body.guid });
	console.log(user,vk,hmd);

	res.status(200).json(user);
};

/*
async function release(req, res) {

  // TODO release HMD/VK back into unassigned pool
  await models.user.update(req.body, {
    where: {
      id: id
    }
  });
  res.status(200).end();
}*/

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
