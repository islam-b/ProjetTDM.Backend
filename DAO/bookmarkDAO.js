const BOOKMARK = require('../models/bookmark');

class BookmarkDAO {

    createBookmark(idArticle,idUser) {
        return BOOKMARK.create({
            idUser: idUser,
            idArticle: idArticle
        });
    }
}

module.exports = BookmarkDAO;