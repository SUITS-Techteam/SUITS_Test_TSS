const { models } = require('../sequelize');
const { simulationStep } = require('../telemetry/eva_telemetry')
const simStateSeed = require('../seed/simstate.json');
const simControlSeed = require('../seed/simcontrol.json');
const simFailureSeed = require('../seed/simfailure.json');
// var SimulationState = mongoose.model('SimulationState')	
// var SimulationControl = mongoose.model('SimulationControl')
// var SimulationFailure = mongoose.model('SimulationFailure')

class EVASimulation {
	simTimer = null;
	simStateID = null;
	simControlID = null;	
	simFailureID = null;
	holdID = null;
	lastTimestamp = null;
	room;

	// Data Objects
	simState = {};
	simControls = {};
	simFailure = {};

	constructor(_room) {
		this.room = _room;
		this.seedInstances();
	}

	async seedInstances() {

		// Get the instances for the room
		console.log(typeof this.room + this.room);
		let state = await models.simulationstate.findOne({ where: { room: parseInt(this.room) } });
		let control = await models.simulationcontrol.findOne({ where: { room: parseInt(this.room) } });
		let failure = await models.simulationfailure.findOne({ where: { room: parseInt(this.room) } });

		// Seed the states on start
		await models.simulationstate.update(simStateSeed, {
			where: { id: state.id }
		});	
		await models.simulationcontrol.update(simControlSeed, {
			where: { id: control.id }
		});	
		await models.simulationfailure.update(simFailureSeed, {
			where: { id: failure.id }
		});
		console.log('Seed Completed');
	}

	isRunning() {
		return simStateID !== null && controlID !== null && failureID !== null
	}

	async start(roomid) {
		console.log('Starting Sim');
		this.simState = {};
		this.simControls = {};
		this.simFailure = {};

		await models.simulationstate.findAll({where: {room: roomid}})
			.then(data => {
				this.simState = data[0].dataValues;
			});

		if(this.simState.isRunning) {
			return false;
		}
		// Update isRunning
		this.simState.isRunning = true;

		await models.simulationcontrol.findAll({where: {room: roomid}}).then(data => {
			console.log(data);
			this.simControls = data[0].dataValues;
		});

		await models.simulationfailure.findAll({where: {room: roomid}}).then(data => {
			console.log(data);
			this.simFailure = data[0].dataValues;
		});

		this.simStateID   = this.simState.id;
		this.simControlID = this.simControls.id;
		this.simFailureID = this.simFailure.id;

		console.log('--------------Simulation Starting--------------')
		this.lastTimestamp = Date.now();
		this.simTimer = setInterval(() => {this.step();}, process.env.SIM_STEP_TIME);
	}

	isPaused() {
		return this.simTimer == null;
	}

	async pause() {
		if (!this.simState.isRunning) {
			throw new Error('Cannot pause: simulation is not running or it is running and is already paused')
		}
		console.log('--------------Simulation Paused-------------')
	
		clearInterval(this.simTimer);
		this.simTimer = null ;
		this.lastTimestamp = null;

		await models.simulationstate.update({isPaused: true}, {
			where: { id: this.simStateID }
		});
	}
	
	async unpause() {
		if (!this.simState.isRunning) {
			throw new Error('Cannot unpause: simulation is not running or it is running and is not paused')
		}

		console.log('--------------Simulation Resumed-------------')
		this.lastTimestamp = Date.now();
		this.simTimer = setInterval(() => {this.step();}, process.env.SIM_STEP_TIME);

		await models.simulationstate.update({isPaused: false}, {
			where: { id: this.simStateID }
		});
	}

	async stop() {
		if (!this.simState.isRunning) {
			throw new Error('Cannot stop: simulation is not running')
		}
		console.log('--------------Simulation Stopped-------------')
		// this.simStateID = null
		// this.controlID = null 
		clearInterval(this.simTimer)
		this.simTimer = null 
		this.lastTimestamp = null

		// Reseed here
		this.seedInstances();
	}
	
	async getState () {
		const simState = await models.SimulationState.findByPk(this.simStateID);
		// await SimulationState.findById(simStateID).exec()
		return simState
	}
	async getControls() {
		const controls = await models.SimulationControl.findByPk(this.simControlID);
		//await SimulationControl.findById(controlID).exec()
		return controls 
	}

	async getFailure() {
		const failure = await models.SimulationFailure.findByPk(this.simFailureID);
		//await SimulationFailure.findById(failureID).exec()
		return failure
	}
	
	async setFailure(newFailure) {
		const failure = await models.simulationfailure.update(newFailure, {
			where: {
				id: this.simFailureID
			}
		});

		// Update Failure Object
		await models.simulationfailure.findAll({where: {room: this.room}}).then(data => {
			this.simFailure = data[0].dataValues;
		});

		return failure
	}
	
	async setControls(newControls) {
		// const controls = await SimulationControl.findByIdAndUpdate(controlID, newControls, {new: true}).exec()
		const controls = await models.simulationcontrol.update(newControls, {
			where: {
				id: this.simControlID
			}
		});

		// Update Controls Object
		await models.simulationcontrol.findAll({where: {room: this.room}}).then(data => {
			this.simControls = data[0].dataValues;
		});
		
		return controls 
	}

	async step() {
		console.log(`StateID: ${this.simStateID}, ControlID: ${this.simControlID}, FailureID: ${this.simFailureID}`);
		console.log(this.simFailure);
		try{
			// const simState = await simulationstate.findById(this.simStateID).exec()
			// const controls = await simulationcontrol.findById(this.controlID).exec()
			// const failure = await simulationfailure.findById(this.failureID).exec()

			const now = Date.now();
			const dt = now - this.lastTimestamp;
			this.lastTimestamp = now;			

			const newSimState = simulationStep(dt, this.simControls, this.simFailure, this.simState)
			Object.assign(this.simState, newSimState)
			// await simState.save()
			await models.simulationstate.update(this.simState, {
				where: {
					id: this.simStateID
				}
			}).then(() => {
				console.log('Updated');
			});			
		}
		catch(error){ 
			console.error('failed error')
			console.error(error.toString())
		}
	}
}
module.exports = EVASimulation;
