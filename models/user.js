const Sequelize = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('user', {
    idUser: {type:Sequelize.STRING,primaryKey: true},
    firstName: {type:Sequelize.STRING},
    lastName: {type:Sequelize.STRING}
});
module.exports = User;