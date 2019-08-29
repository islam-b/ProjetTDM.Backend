const Sequelize = require('sequelize');
const sequelize = require('../database');

const Bookmark = sequelize.define('bookmark', {
    idBookmark: {type:Sequelize.INTEGER,primaryKey: true,autoIncrement:true},
    idUser: {type:Sequelize.STRING},
    idArticle: {type:Sequelize.STRING}
});
module.exports = Bookmark;