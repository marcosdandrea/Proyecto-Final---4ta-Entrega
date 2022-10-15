require("dotenv").config()
const crypto = require("crypto")
const Logger = require("../../scripts/Logger")
const logger = new Logger()
let memory = []

async function saveMessage(messageObject) {
    try {
        messageObject.messageID = crypto.randomUUID()
        console.log("Saving new message")
        memory.push(messageObject)
        return (messageObject.messageID)
    } catch (err) {
        console.log ("Error saving message")
        logger.logError("messages.DAO.memory:" + err.message)
        return (err)
    }
}

async function getAllMessages() {
    try {
        const allMessageMapped = memory.map(msg =>
        ({
            id: msg.messageID,
            author: JSON.parse(msg.author),
            text: JSON.parse(msg.text)
        }))
        return (allMessageMapped)
    } catch (err) {
        logger.logError("messages.DAO.memory:" + err.message)
        return (err)
    }
}

module.exports = { getAllMessages, saveMessage }