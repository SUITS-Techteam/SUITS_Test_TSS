const sequelize = require('../sequelize');
// const { pickRandom, randomDate } = require('./helpers/random');

sequelize.sync({ force: true });