const Sequelize = require('sequelize');
const initModels = require('./init-models');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const sequelize = new Sequelize(config);

const db = initModels(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
