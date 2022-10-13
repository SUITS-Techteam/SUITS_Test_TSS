const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('simulationcontrol', {
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
		suit_power: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
		},
        o2_switch: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        aux: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        rca: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        pump: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        fan_switch: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        }
	});
};
