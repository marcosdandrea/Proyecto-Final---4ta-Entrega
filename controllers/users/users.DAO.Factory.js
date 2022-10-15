const usersDAOMemory = require("./users.DAO.memory")
const usersDAOMongo = require("./users.DAO.mongo")

function DAOFactory(mode) {
    return (mode == "production") ?
        usersDAOMongo : usersDAOMemory
}

module.exports = {DAOFactory}