const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('simulationstate', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
        room: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        isRunning: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isPaused: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
		time: {
			allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
		},
		timer: {
			allowNull: false,
			type: DataTypes.STRING,
            defaultValue: '00:00:00'
		},
        started_at: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: '00:00:00'
        },
        heart_bpm: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0,
        },
        p_sub: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        p_suit: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        t_sub: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        v_fan: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        p_o2: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        rate_o2: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        batteryPercent: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 100
        },
        cap_battery: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        battery_out: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 100
        },
        p_h2o_g: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        p_h2o_l: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        p_sop: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        rate_sop: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        t_battery: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: '00:00:00'
        },
        t_oxygenPrimary: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 100
        },
        t_oxygenSec: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 100
        },
        ox_primary: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 100
        },
        ox_secondary: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 100
        },
        t_oxygen: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: '00:00:00'
        },
        cap_water: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 100
        },
        t_water: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: '00:00:00'
        }
	});
};
