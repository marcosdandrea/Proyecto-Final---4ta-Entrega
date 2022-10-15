require("dotenv").config()
const passport = require("passport")
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy;
const {DAOFactory} = require("../controllers/users/users.DAO.Factory")
const Logger = require("../scripts/Logger")
const argv = require('minimist')(process.argv.slice(2));


const DAO = DAOFactory(argv.mode)
const logger = new Logger() 

passport.use("registration", new LocalStrategy(
    {passReqToCallback : true},
    async (req, username, password, callback) => {
    try {
        const existentUser = await DAO.getUser(username)
        if (existentUser){
            logger.logError("Ya existe el usuario")
            return callback(new Error("Ya existe el usuario"))     
        }
        const hashedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const { file } = req;

        const birthday = (req.body.birthday).split("/")
        const birthdayFormatted = birthday[1]+"/"+birthday[0]+"/"+birthday[2]

        let level = "user"

        //for testing purposes only
        if (process.env.ALLOW_FORCE_ADMIN == "true")
        level = req.body.alias=="admin" ? "admin" : "user" 

        const newUser = {
            fullname: req.body.fullname, 
            username, 
            password: hashedPass, 
            birthday: birthdayFormatted,
            address: req.body.address,
            telephone: req.body.telephone,
            alias: req.body.alias,
            profilePic: file.filename,
            level,
         }
         
        await DAO.saveNewUser(newUser)
        callback(null, newUser)
    } catch (err) {
        logger.logError(err)
        callback(new Error(err))
    }
}));

passport.use("login", new LocalStrategy(
    {passReqToCallback : true},
    async (req, username, password, callback) => {
    try {
        const existentUser = await DAO.getUser(username)
        if (!existentUser ||!bcrypt.compareSync(password, existentUser.password))
            return callback(new Error ("Usuario o contraseña incorrectos"))    
        callback(null, existentUser)
    } catch (err) {
        logger.logError(err)
        callback(new Error(err))
    }
}));

passport.serializeUser((user, callback) => {
    callback(null, user.username)
})

passport.deserializeUser(async (username, callback) => {
    try {
        const existentUser = await DAO.getUser(username)
        callback(null, existentUser)
    } catch (err) {
        logger.logError(err)
        callback(new Error(err))
    }
})

module.exports = passport;