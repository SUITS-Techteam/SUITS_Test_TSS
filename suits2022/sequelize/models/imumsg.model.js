const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('imumsg', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: true,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		heading: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false
		},
		accel_x: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false
		},
		accel_y: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false
		},
		accel_z: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false
		},
		gyro_x: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false
		},
		gyro_y: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false
		},
		gyro_z: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false
		},
		mag_x: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false
		},
		mag_y: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false
		},
		mag_z: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false
		}
	});
};
