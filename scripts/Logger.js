const winston = require("winston")

const loggerInfo = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console({ level: "info" }),
    ]
})

const loggerWarn = winston.createLogger({
    level: "warn",
    transports: [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File ({ filename: "./logs/warn.log", level: "warn" }),
    ]
})

const loggerError = winston.createLogger({
    level: "error",
    transports: [
        new winston.transports.Console({ level: "error" }),
        new winston.transports.File ({ filename: "./logs/error.log", level: "error" }),
    ]
})

module.exports = class Logger{
    constructor(){ }

    logRequest(req, res, next){
        const data = {route: req.path, method: req.method}
        loggerInfo.log("info", data)
        next()
    }

    logWarn(req, error){
        const data = {route: req.path, method: req.method, message: error}
        loggerWarn.log("warn", data)
    }

    logError(message){
        loggerError.log("error", message)
    }
}