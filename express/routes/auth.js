const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const crypto = require('node:crypto');

let secretkey = "admin78$Akt";

//TODO
//add getUser endpoint by assignment GUID

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

	//////////// User Checks

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

	//////////// Room Checks

	//TODO check if room is full
	if(req.body.room === undefined || req.body.room > 24) {
		res.status(400).json({ ok: false, err: 'Room ID is missing or out of range'});
		return;
	}

	//////////// VK Assignment

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

	//////////// HMD Assignment

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

	next_vk.assignment = req.body.guid;
	await next_vk.save();

	next_hmd.assignment = req.body.guid;
	await next_hmd.save();

	res.status(200).json(user);
};

async function assignmentLookup(req, res) {

	if(req.body.hmd === undefined && req.body.vk === undefined) {
		res.status(400).json({ ok: false, err: "HMD or VK not specified"});
		return;
	}

	if(req.body.hmd) {
		let hmds;
		try {
			hmds = await getHMDs();
		} catch (err) {
			console.log(err);
			res.status(400).json({ ok: false, err: "Could not get HMDs"});
			return;
		};

		for( const hmdrecord of hmds){
			if(req.body.hmd === hmdrecord.name) {
				res.status(200).json({ ok: true, data: hmdrecord });
				return;
			}
		}
	}

	if(req.body.vk) {

		let vks;
		try {
			vks = await getVKs();
		} catch (err) {
			console.log(err);
			res.status(400).json({ ok: false, err: "Could not get VKs"});
			return;
		};

		for( const vkrecord of vks){
			if(req.body.vk === vkrecord.name) {
				res.status(200).json({ ok: true, data: vkrecord });
				return;
			}
		}
	}

	res.status(400).json({ ok: false, err: "VK or HMD not found"});
	return;
}

async function assignmentRelease(req, res) {

	if(req.body.hmd === undefined && req.body.vk === undefined) {
		res.status(400).json({ ok: false, err: "HMD or VK not specified"});
		return;
	}

	if(req.body.secret !== secretkey) {
		res.status(400).json({ ok: false, err: "Unauthorized"});
		return;
	}

	let name;
	if(req.body.hmd) {

		let hmds;
		try {
			hmds = await getHMDs();
		} catch (err) {
			console.log(err);
			res.status(400).json({ ok: false, err: "Could not get HMDs"});
			return;
		};

		for( const hmdrecord of hmds){

			let users;
			try {
				users = await getUsers();
			} catch (err) {
				console.log(err);
				res.status(400).json({ ok: false, err: "Could not get Users"});
				return;
			};

			for(const userRecord of users) {
				if(hmdrecord.assignment === userRecord.guid) {
					userRecord.hmd = null;
					userRecord.save();
				}
			}

			if(req.body.hmd === hmdrecord.name) {
				hmdrecord.assignment = null;
				await hmdrecord.save();
				res.status(200).json({ ok: true, data: hmdrecord });
				return;
			}
		}


	}

	if(req.body.vk) {

		let vks;
		try {
			vks = await getVKs();
		} catch (err) {
			console.log(err);
			res.status(400).json({ ok: false, err: "Could not get VKs"});
			return;
		};

		for( const vkrecord of vks){
			if(req.body.vk === vkrecord.name) {

				let users;
				try {
					users = await getUsers();
				} catch (err) {
					console.log(err);
					res.status(400).json({ ok: false, err: "Could not get Users"});
					return;
				};

				for(const userRecord of users) {
					if(vkrecord.assignment === userRecord.guid) {
						userRecord.visionkit = null;
						userRecord.save();
					}
				}

				vkrecord.assignment = null;
				await vkrecord.save();

				res.status(200).json({ ok: true, data: vkrecord });
				return;
			}
		}

		return;
	}

	res.status(400).json({ ok: false, err: "Could not release VK or HMD."});
	return;
}

async function findUser(req, res) {

	if( (req.body.username === undefined || req.body.username === '') &&
			(req.body.guid === undefined  || req.body.guid === '') ) {
		res.status(400).json({ ok: false, err: 'Username or guid is missing or empty' });
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
		if(req.body.guid === userRecord.guid) {
			res.status(200).json({ ok: false, user: userRecord });
			return;
		}

		if(req.body.username === userRecord.username) {
			res.status(200).json({ ok: false, user: userRecord });
			return;
		}
	}

	res.status(400).json({ ok: false, err: "Could not find User"});
}

async function update(req, res) {

    await models.user.update(req.body, {
        where: {
            id: id
        }
    });
    res.status(200).end();
}

module.exports = {
	registerUser,
	assignmentLookup,
	assignmentRelease,
	findUser
};
