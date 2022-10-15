require("dotenv").config()
const mongoose = require("mongoose")
const user = require("./users.model")

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}


async function saveNewUser(userObject) {
    await mongoose.connect(process.env.MONGO_URL, mongoOptions)
    const username = userObject.username
    const existentUser = await user.find({ username })
    if (existentUser.length != 0) {
        mongoose.disconnect();
        throw new Error("username is in use")
    } else {
        const newUser = new user(userObject)
        await newUser.save()
        mongoose.disconnect();
        return (newUser._id)
    }

}

async function getUser(username) {
    await mongoose.connect(process.env.MONGO_URL, mongoOptions)
    const existentUser = await user.findOne({ username })
    if (!existentUser) {
        mongoose.disconnect();
        return (null)
    } else {
        mongoose.disconnect();
        return (existentUser)
    }
}


module.exports = { saveNewUser, getUser}