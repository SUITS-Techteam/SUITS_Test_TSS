const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const evaSimulation = require('../../simulations/evasimulation');

sims = [];

async function commandSim(req, res) {
	console.log(`Room: ${req.params.room} Event: ${req.params.event}`);

	if(req.params.event && req.params.room) {

		// Check if the sim already exists
		let existingSim = sims.find(x => x.room === req.params.room);

		switch(req.params.event) {
			case "start":
				console.log(`Sim INstance Count: ${sims.length}`);		
				let simInst = {};
				if(!existingSim) {
					simInst = {
						room: req.params.room,
						sim: new evaSimulation(req.params.room),
						controls: {
							fan_switch: false,
							suit_power: false,
							o2_switch: false,
							aux: false,
							rca: false,
							pump: false },
						failure: {
							o2_error: false,
							pump_error: false,
							power_error: false,
							fan_error: false
						}
					}
				} else {
					simInst = existingSim;
				}

				// Attempt to start the sim.		
				sims.push(simInst);
				// Start w/ 1sec delay
				setTimeout(() => {
					simInst.sim.start(simInst.room);
				}, 1000);
				
				break;
			case "pause":
				if(existingSim) {
					existingSim.sim.pause();
				} else {
					res.status(400).json({ok: false, err: "Simulation must be started before it can be paused."})
				}
				break;
			case "unpause":
				if(existingSim) {
					existingSim.sim.unpause();
				} else {
					res.status(400).json({ok: false, err: "Simulation must be paused before it can be unpaused."})
				}
				break;
			case "stop":
				if(existingSim) {
					existingSim.sim.stop();
				} else {
					res.status(400).json({ok: false, err: "Simulation must be running or paused before it can be stopped."})
				}
				break;
		}
	} else {
		res.status(400).json({ ok:false, err: "A room and event are both required." });
	}
	res.status(200).json({ok: true, event: req.params.event});	
}

async function controlSim(req, res) {
	let simInst = sims.find(x => x.room === req.params.room);

	if(!simInst) {
		res.status(400).json({ok: false, err: 'No sim found to command. Have you started the simulation?'});
		console.warn(`CTRL No Sim Found of ${this.sims.length} sims`);
	}

	switch(req.params.control) {
		case "fan_switch":
			simInst.controls.fan_switch = !simInst.controls.fan_switch;
			break;
		case "suit_power":
			console.log(`Instance Room: ${simInst.room} `);
			simInst.controls.suit_power = !simInst.controls.suit_power;
			break;
		case "o2_switch":
			simInst.controls.o2_switch = !simInst.controls.o2_switch;
			break;
		case "aux":
			simInst.controls.aux = !simInst.controls.aux;
			break;
		case "rca":
			simInst.controls.rca = !simInst.controls.rca;
			break;
		case "pump":
			simInst.controls.pump = !simInst.controls.pump;
			break;
	}

	simInst.sim.setControls(simInst.controls);
	res.status(200).send({ ok: true, controls: simInst.controls});
}

async function failureSim(req, res) {
	let simInst = sims.find(x => x.room === req.params.room);

	if(!simInst) {
		res.status(400).json({ok: false, err: 'No sim found to apply failures. Have you started the simulation?'});
		console.warn(`CTLFAILURE No Sim Found of ${this.sims.length} sims`);
	}

	switch(req.params.failure) {
		case "o2_error":
			simInst.failure.o2_error = !simInst.failure.o2_error;
			break;
		case "pump_error":			
			simInst.failure.pump_error = !simInst.failure.pump_error;
			break;
		case "power_error":
			simInst.failure.power_error = !simInst.failure.power_error;
			break;
		case "fan_error":
			simInst.failure.fan_error = !simInst.failure.fan_error;
			break;
	}

	simInst.sim.setFailure(simInst.failure);
	res.status(200).send({ ok: true, failures: simInst.failure});
}

async function getAll(req, res) {
	const simulationcontrols = await models.simulationcontrol.findAll();
	res.status(200).json(simulationcontrols);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const simulationcontrol = await models.simulationcontrol.findByPk(id);
	if (simulationcontrol) {
		res.status(200).json(simulationcontrol);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByRoomId(req, res) {
	const id = req.params.room;
	const simulationcontrol = await models.simulationcontrol.findAll({where: {room: id}});
	if (simulationcontrol) {
		res.status(200).json(simulationcontrol);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.simulationcontrol.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);
    await models.simulationcontrol.update(req.body, {
        where: {
            id: id
        }
    });
    res.status(200).end();
};

async function remove(req, res) {
	const id = getIdParam(req);
	await models.simulationcontrol.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

module.exports = {
	commandSim,
	controlSim,
	failureSim,
	getAll,
	getById,
	getByRoomId,
	create,
	update,
	remove	    
};
