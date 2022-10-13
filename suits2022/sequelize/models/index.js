const room               = require('./room.model');
const simulationcontrol  = require('./simulationcontrol.model');
const simulationfailure  = require('./simulationfailure.model');
const simulationstate    = require('./simulationstate.model');
const simulationstateUIA = require('./simulationstateUIA.model');
const simulationuia      = require('./simulationUIA.model');
const user               = require('./user.model');

module.exports = {
    room,
    simulationcontrol,
    simulationfailure,
    simulationstate,
    simulationstateUIA,
    simulationuia,
    user
}