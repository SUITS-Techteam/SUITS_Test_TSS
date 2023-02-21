const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('devices', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true
		},/*
		room: {
			allowNull: false,
			type: DataTypes.INTEGER,
			unique: false
		},*/
		guid: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		description: {
			allowNull: true,
			type: DataTypes.STRING
		},
		type: {
			allowNull: true,
			type: DataTypes.STRING,
			validate: {
				isIn: [["VK","HMD","EVA","RVR","SPC"]]
			}
		},
		macaddress: {
			allowNull: false,
			type: DataTypes.STRING
		}
	});
};
