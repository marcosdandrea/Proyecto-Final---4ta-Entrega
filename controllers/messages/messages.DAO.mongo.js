require("dotenv").config()
const mongoose = require("mongoose")
const message = require("./messages.model")

async function saveMessage(messageObject) {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        const newMesssage = new message(messageObject)
        await newMesssage.save()
        mongoose.disconnect();
        return (newMesssage._id)
    } catch (err) {
        return (err)
    }
}

async function getAllMessages() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        const allMessage = await message.find({}, { '__v': 0 })
        const allMessageMapped = allMessage.map(msg =>
        ({
            id: msg._id,
            author: JSON.parse(msg.author),
            text: JSON.parse(msg.text)
        }))
        return (allMessageMapped)
    } catch (err) {
        return (err)
    }

}


module.exports = { saveMessage, getAllMessages }