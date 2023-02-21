const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('simulationstateuia', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
        room: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
		started_at: {
			allowNull: true,
			type: DataTypes.STRING
		},
		emu1: {
			allowNull: false,
			type: DataTypes.STRING,
            defaultValue: 'OFF'
		},
        emu2: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: 'OFF'
        },
        o2_supply_pressure1: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 29
        },
        o2_supply_pressure2: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 29
        },
        ev1_supply: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: 'CLOSE'
        },
        ev2_supply: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: 'CLOSE'
        },
        ev1_waste: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: 'CLOSE'
        },
        ev2_waste: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: 'CLOSE'
        },
        emu1_O2: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: 'CLOSE'
        },
        emu2_O2: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: 'CLOSE'
        },
        oxygen_supp_out1: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },
        oxygen_supp_out2: {
            allowNull: false,
			type: DataTypes.NUMBER,
            defaultValue: 0
        },        
        O2_vent: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: 'CLOSE'
        },
        depress_pump: {
            allowNull: false,
			type: DataTypes.STRING,
            defaultValue: 'FAULT'
        },
	});
};
