const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('hmd', {
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
		},
		description: {
			allowNull: true,
			type: DataTypes.STRING
		},
		assignment: {
			allowNull: true,
			type: DataTypes.STRING
		},
		macaddress: {
			allowNull: false,
			type: DataTypes.STRING
		}
	});
};
