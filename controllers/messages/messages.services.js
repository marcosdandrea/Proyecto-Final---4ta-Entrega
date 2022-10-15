const { DAOFactory } = require("./messages.DAO.Factory")
const NormalizeMsg = require("../../scripts/NormalizeMsg")
const Logger = require("../../scripts/Logger")
const argv = require('minimist')(process.argv.slice(2));

const DAO = DAOFactory(argv.mode)
const normalize = new NormalizeMsg()
const logger = new Logger()

async function newMessage(message) {
    try {
        await DAO.saveMessage(message)
    } catch (err) {
        console.log (err)
        logger.logError("newMessage: " + err)
    }
}

async function sendAllMessages(socket) {
    try{
        const message = await DAO.getAllMessages()
        const normalizedMsgs = normalize.normalize(message)
        socket.emit("newMessages", JSON.stringify(normalizedMsgs))   
    }catch(err) {
        logger.logError("sendAllMessages: " + err)
    }  
}

module.exports = { newMessage, sendAllMessages }