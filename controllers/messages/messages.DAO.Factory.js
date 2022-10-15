const messagesDAOMemory = require("./messages.DAO.memory")
const messagesDAOMongo = require("./messages.DAO.mongo")

function DAOFactory(mode) {
    return (mode == "production") ?
        messagesDAOMongo : messagesDAOMemory
}

module.exports = {DAOFactory}