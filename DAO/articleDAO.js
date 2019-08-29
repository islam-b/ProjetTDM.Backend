const ARTICLE = require('../models/article');
const USER = require('../models/user');
const BOOKMARK = require('../models/bookmark');
const UserDAO  = require('./userDAO');
const userDAO = new UserDAO();
USER.belongsToMany(ARTICLE,{as:'articles',foreignKey:'idUser',through:BOOKMARK,otherKey:'idArticle'});
ARTICLE.belongsToMany(USER,{as:'articles',foreignKey:'idArticle',through:BOOKMARK,otherKey:'idUser'});

class ArticleDAO {

    createArticle(article) {
        return ARTICLE.create({
            idArticle:   article.idArticle,
            title:       article.title,
            description: article.description,
            link:        article.link,
            content:     article.content,
            lang:        article.lang,
            source:      article.source,
            category:    article.category,
            date:        article.date,
            imageUrl:    article.imageUrl
        });
    }

    findArticle(idArticle) {
        return ARTICLE.findOne({where: {idArticle:idArticle}});
    }

    getArticlesForUser(idUser) {
        return new Promise((resolve, reject) => {
            userDAO.findUser(idUser).then(user=>{
                    resolve(user.getArticles());
            }).catch(error=>{
                reject(error);
            });
        });
    }



}

module.exports =ArticleDAO;