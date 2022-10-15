const passport = require("../../scripts/passport")
const SendMail = require("../../scripts/NodeMailer.js")
const twilio = require("twilio")
const cookieParser = require("cookie-parser")
const Logger = require("../../scripts/Logger")

require("dotenv").config()

const accountSid = "ACf1d66d4d7a162851454421b00e2b3a80"
const authToken = "c783258223ebb73868be5f9806d81e56"

const client = twilio(accountSid, authToken)
const notificationMail = new SendMail()
const logger = new Logger()

module.exports = class OrdersAPI {

    constructor(app) {
        this.app = app;
        this.app.use(cookieParser())

        this.app.post("/orders",
            this.checkAuthorized,
            (req, res, next) => {

                const order = req.body[0]
                const userData = req.body[1]

                const mailOptions = {
                    from: "Servidor Backend",
                    to: process.env.NOTIFICATION_EMAIL,
                    subject: "Nuevo pedido de " + userData.alias + " (" + userData.username + ")",
                    html: this.generateHTMLOrderView(order)
                }

                notificationMail.sendMail(mailOptions)

                this.sendWsp("+14155238886", "+5491140674938", this.generatePlainOrderView(order))
                const rand = Math.floor(Math.random() * 548648464)
                this.sendSms("+" + userData.telephone, "Su pedido número " + rand + " está siendo procesado.")
                res.sendStatus(200)
            })

    }

    generateHTMLOrderView(order) {
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

    generatePlainOrderView(order) {
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

    async sendWsp(from, to, body) {
        await client.messages
            .create({
                body,
                from: 'whatsapp:' + from,
                to: 'whatsapp:' + to
            })
            .catch(err => logger.logWarn(err))
            .done()
    }

    async sendSms(to, body) {
        await client.messages
            .create({
                body,  
                messagingServiceSid: 'MGe10cedf244c444041aae542b2c092717',      
                to
            })
            .catch(err => logger.logWarn(err))
            .done()
    }

    checkAuthorized(req, res, next) {
        if (req.user?.level == "admin" || req.user?.level == "user") {
            console.log(">> usuario autorizado")
            next()
        } else {
            logger.logWarn ("error", "Acceso no autorizado")
            console.log(">> usuario no autorizado")
            res.status(401)
            res.send("Acceso denegado")
        }
    }
}