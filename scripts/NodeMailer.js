require("dotenv").config()
const { createTransport } = require("nodemailer")
const Logger = require("./Logger")
const logger = new Logger()

const transporter = createTransport({
    host: process.env.ADMIN_USER_HOST,
    port: parseInt(process.env.ADMIN_USER_PORT),
    auth: {
        user: process.env.ADMIN_EMAIL_USER,
        pass: process.env.ADMIN_EMAIL_PASS
    }
});


async function sendMail(mailOptions) {
    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        logger.logError(error)
    }
}

module.exports = {sendMail}
