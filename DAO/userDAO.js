const USER = require('../models/user');

class UserDAO {

    createUser(user) {
        return USER.create({
            idUser: user.idUser,
            firstName: user.firstName,
            lastName: user.lastName
        });
    }

    findUser(idUser) {
        return USER.findOne({
            where:{idUser: idUser}
        });
    }
}

module.exports = UserDAO;