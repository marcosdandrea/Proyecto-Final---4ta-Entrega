const productsDAOMemory = require("./products.DAO.memory")
const productsDAOMongo = require("./products.DAO.mongo")

function DAOFactory(mode) {
    return (mode == "production") ?
        productsDAOMongo : productsDAOMemory
}

module.exports = DAOFactory