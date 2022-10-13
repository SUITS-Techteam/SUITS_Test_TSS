const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('simulationfailure', {
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
		o2_error: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
		},
        pump_error: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        power_error: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        fan_error: {
            allowNull: false,
			type: DataTypes.BOOLEAN,
            defaultValue: false
        }
	});
};
