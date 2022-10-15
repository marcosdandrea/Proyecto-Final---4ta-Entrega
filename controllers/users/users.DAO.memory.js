require("dotenv").config()
const crypto = require("crypto")
let memory = []

async function saveNewUser(userObject) {
    userObject.userID = crypto.randomUUID() 
    memory.push (userObject)
    return (userObject.userID)
}

async function getUser(username) {
    const answ = memory.find(item => item.username === username)
    if (answ == -1) throw new Error("Username not found: " + username)
    return (answ)
}

module.exports = { saveNewUser, getUser}