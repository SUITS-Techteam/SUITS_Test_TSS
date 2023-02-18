
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('gpsmsg', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		device: {
			allowNull: true,
			type: DataTypes.STRING,
			unique: false,
			defaultValue: null
		},
		mode: {
			allowNull: true,
			type: DataTypes.INTEGER,
			unique: false,
			defaultValue: null
		},
		time: {
			allowNull: true,
			type: DataTypes.STRING,
			unique: false,
			defaultValue: null
		},
		ept: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
		},
		lat: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
		},
		lon: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
		},
		alt: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
		},
		epx: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
		},
		epy: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
		},
		epv: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
		},
		track: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
		},
		speed: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
		},
		climb: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
		},
		eps: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
			
		},
		epc: {
			allowNull: true,
			type: DataTypes.DOUBLE,
			unique: false,
			defaultValue: null
		},
	});
};
