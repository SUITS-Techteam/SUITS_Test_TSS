const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.    
module.exports = (sequelize) => {
	sequelize.define('simulationuia', {
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
			type: DataTypes.BOOLEAN,
            defaultValue: false
		},
        ev1_supply: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ev1_waste: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        emu1_O2: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        emu2: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ev2_supply: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ev2_waste: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        emu2_O2: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        O2_vent: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        depress_pump: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        }
	});
};
