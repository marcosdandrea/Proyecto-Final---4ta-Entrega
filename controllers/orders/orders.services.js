require("dotenv").config()
const { sendMail } = require("../../scripts/NodeMailer")
const twilio = require("twilio")
const Logger = require("../../scripts/Logger")
const logger = new Logger()

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

async function newOrder(req, res, next) {
    const order = req.body[0]
    const userData = req.body[1]

    const mailOptions = {
        from: "Servidor Backend",
        to: process.env.NOTIFICATION_EMAIL,
        subject: "Nuevo pedido de " + userData.alias + " (" + userData.username + ")",
        html: generateHTMLOrderView(order)
    }

    try {
        sendMail(mailOptions)

        await sendWsp(generatePlainOrderView(order))
        const rand = Math.floor(Math.random() * 548648464)
        await sendSMS("+" + userData.telephone, "Su pedido número " + rand + " está siendo procesado.")
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send("There was a problem creating the order. Please try again.")
        logger.logError("Creating Order: " + err)
    }
}

function generateHTMLOrderView(order) {
    let view = "<h3> ++ NEW ORDER ++ </h3>"
    order.forEach(item => {
        view += "<p>=================================</p>"
        view += "<p>ID: " + item.productID + "</p>"
        view += "<p>Name: " + item.productName + "</p>"
        const total = parseInt(item.productAmount) * parseFloat(item.productPrice.slice(1))
        view += "<p>" + item.productAmount + " x (" + item.productPrice + ") $" + total + "</p>"
    })
    view += "<p>===============END===============</p>"
    return view
}

function generatePlainOrderView(order) {
    let view = "++ NEW ORDER ++ \n"
    order.forEach(item => {
        view += "=================================\n"
        view += "ID: " + item.productID + "\n"
        view += "Name: " + item.productName + "\n"
        const total = parseInt(item.productAmount) * parseFloat(item.productPrice.slice(1))
        view += "" + item.productAmount + " x (" + item.productPrice + ") $" + total + "\n"
    })
    view += "===============END===============\n"
    return view
}

async function sendWsp(body) {
    await client.messages
        .create({
            body,
            from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_FROM,
            to: 'whatsapp:' + process.env.TWILIO_WHATSAPP_TO
        })
        .catch(err => logger.logWarn(err))
        .done()
}

async function sendSMS(to, body) {
    await client.messages
        .create({
            body,
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICES_SID,
            to
        })
        .catch(err => logger.logWarn(err))
        .done()
}

function checkAuthorized(req, res, next) {
    if (req.user?.level == "admin" || req.user?.level == "user") {
        console.log(">> usuario autorizado")
        next()
    } else {
        logger.logWarn("error", "Acceso no autorizado")
        console.log(">> usuario no autorizado")
        res.status(401)
        res.send("Acceso denegado")
    }
}

module.exports = { newOrder, checkAuthorized }