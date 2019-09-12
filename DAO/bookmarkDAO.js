const BOOKMARK = require('../models/bookmark');

class BookmarkDAO {

    createBookmark(idArticle,idUser) {
        return BOOKMARK.create({
            idUser: idUser,
            idArticle: idArticle
        });
    }

    deleteBookmark(idArticle,idUser) {
        return BOOKMARK.destroy({where: {
            idUser: idUser, idArticle:idArticle}
        })
    }
}

module.exports = BookmarkDAO;