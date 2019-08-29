const Sequelize = require('sequelize');
const sequelize = require('../database');

const Article = sequelize.define('article', {
    idArticle: {type:Sequelize.STRING,primaryKey: true},
    title: {type:Sequelize.STRING},
    description: {type:Sequelize.STRING},
    link: {type:Sequelize.STRING},
    content: {type:Sequelize.STRING},
    lang: {type:Sequelize.STRING},
    source: {type:Sequelize.STRING},
    category: {type:Sequelize.STRING},
    date: {type:Sequelize.STRING},
    imageUrl: {type:Sequelize.STRING},


});
module.exports = Article;