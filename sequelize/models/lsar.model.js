const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('lsar', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		sender: {
			allowNull: false,
			type: DataTypes.INTEGER
		},
        room: {
			allowNull: false,
			type: DataTypes.INTEGER
		},
        time: {
            allowNull: true,
			type: DataTypes.STRING
        },
        priority_tag: {
            allowNull: true,
			type: DataTypes.STRING
        },
        encoded_lat: {
            allowNull: true,
			type: DataTypes.STRING
        },
        encoded_lon: {
            allowNull: true,
			type: DataTypes.STRING
        },
        pnt_source: {
            allowNull: true,
			type: DataTypes.STRING
        },
        condition_state: {
            allowNull: true,
			type: DataTypes.STRING
        },
        vmc_txt: {
            allowNull: true,
			type: DataTypes.STRING
        },
        tac_sn: {
            allowNull: true,
			type: DataTypes.STRING
        },
        cntry_code: {
            allowNull: true,
			type: DataTypes.STRING
        },
        homing_dvc_stat: {
            allowNull: true,
			type: DataTypes.STRING
        },
        ret_lnk_stat: {
            allowNull: true,
			type: DataTypes.STRING
        },
        test_proto: {
            allowNull: true,
			type: DataTypes.STRING
        },
        vessel_id: {
            allowNull: true,
			type: DataTypes.STRING
        },
        beacon_type: {
            allowNull: true,
			type: DataTypes.STRING
        }
	});
};
