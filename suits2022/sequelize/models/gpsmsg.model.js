
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
		class: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: false
		},
		device: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: false
		},
		mode: {
			allowNull: false,
			type: DataTypes.INTEGER,
			unique: false
		},
		time: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: false
		},
		ept: {
			allowNull: false,
			type: DataTypes.DOUBLE,
			unique: false
		}
	});
};
