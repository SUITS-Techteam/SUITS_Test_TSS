const { models } = require('../../sequelize');
//const { getIdParam } = require('../helpers');
const  EVASimulation  = require('../../simulations/evasimulation');
console.log(EVASimulation)

class Simulation {
	constructor() {
		this.sims = [];
	}

	async commandSim(room, event) {
		console.log(`Room: ${room} Event: ${event}`);

		if(event && room) {

			// Check if the sim already exists
			let existingSim = this.sims.find(x => x.room === room);

			switch(event) {
				case "start":
					console.log(`Sim INstance Count: ${this.sims.length}`);
					let simInst = {};
					if(!existingSim) {
						simInst = {
							room: room,
							sim: new EVASimulation(room),
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
						};
					} else {
						simInst = existingSim;
					}

					// Attempt to start the sim.
					this.sims.push(simInst);
					// Start w/ 1sec delay
					setTimeout(() => {
						simInst.sim.start(simInst.room);
					}, 1000);

					break;
				case "pause":
					if(existingSim) {
						existingSim.sim.pause();
					} else {
						return {ok: false, err: "Simulation must be started before it can be paused."};
					}
					break;
				case "unpause":
					if(existingSim) {
						existingSim.sim.unpause();
					} else {
						return {ok: false, err: "Simulation must be paused before it can be unpaused."};
					}
					break;
				case "stop":
					if(existingSim) {
						existingSim.sim.stop();
					} else {
						return {ok: false, err: "Simulation must be running or paused before it can be stopped."};
					}
					break;
			}
		} else {
			return { ok:false, err: "A room and event are both required." };
		}
		return {ok: true, event: event};
	}

	async controlSim(room,control) {
		let simInst = this.sims.find(x => x.room === room);

		if(!simInst) {
			return {ok: false, err: 'No sim found to command. Have you started the simulation?'};
			console.warn(`CTRL No Sim Found of ${this.sims.length} sims`);
		}

		switch(control) {
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
		return { ok: true, controls: simInst.controls};
	}

	async failureSim(room,failure) {
		let simInst = this.sims.find(x => x.room === room);

		if(!simInst) {
			return {ok: false, err: 'No sim found to apply failures. Have you started the simulation?'};
			console.warn(`CTLFAILURE No Sim Found of ${this.sims.length} sims`);
		}

		switch(failure) {
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
		return { ok: true, failures: simInst.failure};
	}

	async getByRoomId(room) {
		const id = room;
		const simulationstates = await models.simulationstate.findAll({where: {room: id}});
		const simulationcontrols = await models.simulationcontrol.findAll({where: {room: id}});
		const simulationfailures = await models.simulationfailure.findAll({where: {room:id}});
		const simulationuias = await models.simulationuia.findAll({where: {room:id}});
		const simulationstateuias = await models.simulationstateuia.findAll({where: {room:id}});
		let data  = { simulationstates, simulationcontrols, simulationfailures, simulationuias, simulationstateuias};
			return { ok: true, all: data};
	};

	async getAllState() {
		const simulationcontrols = await models.simulationcontrol.findAll();
		const simulationstates = await models.simulationstate.findAll();
		const simulationfailures = await models.simulationfailure.findAll();
		const simulationuias = await models.simulationuia.findAll();
		const simulationstateuias = await models.simulationstateuia.findAll();
		return { ok: true, simuias: simulationuias,
						 simstateuias: simulationstateuias,
						 simcontl: simulationcontrols,
						 simfails: simulationfailures, simstates: simulationstates};
	};
}

module.exports = Simulation;
