const multer = require("multer");
const passport = require("../../scripts/passport")
const {sendMail} = require("../../scripts/NodeMailer")
const argv = require('minimist')(process.argv.slice(2));

const storage = multer.diskStorage({
    destination: "public/images/profiles",
    filename: (req, file, cb) => {
        const filename = file.originalname;
        cb(null, filename)
    }
})

const uploader = multer({ storage: storage })

function signInSuccess(req, res, next) {

    const mailOptions = {
        from: "Servidor Backend",
        to: process.env.NOTIFICATION_EMAIL,
        subject: "Nuevo registro",
        html: "El usuario " + req.body.fullname + " se ha registrado con el mail " + req.body.username
    }

    sendMail(mailOptions)
    next()
}


function loginSuccess (req, res, next) {
    const cookieContent = generateCookie(req)
    res.cookie("user", JSON.stringify(cookieContent))
    console.log ("login success. Level:", req.user.level)
    if (req.user.level == "admin"){
        res.status(200).redirect("/panel")
        console.log("> Administrador logueado:", req.user.username)
    }else{
        res.status(200).redirect("/carrito")
        console.log("> Usuario logueado:", req.user.username)
    }
}

function closeSession(req, res, next){
    if (req.user) {
        console.log("Cerrando sesion")
        req.logout(function (err) {
            if (err) return next(err);
            res.redirect("/")
        });
    } else {
        res.redirect("/")
    }
}

function generateCookie(req){
    return {
        alias: req.user.alias,
        username: req.user.username,
        profilePic: req.user.profilePic,
        telephone: req.user.telephone
    }
}

module.exports = {passport, uploader, signInSuccess, loginSuccess, closeSession }