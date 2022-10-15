
require("dotenv").config()
const express = require("express");
const http = require("http")
const cluster = require("cluster")
const numCPUs = require("os").cpus().length
const argv = require('minimist')(process.argv.slice(2));
const PORT = process.env.PORT || 8080;
const processMode = argv.mode || "fork"
const Logger = require("./scripts/Logger")
const logger = new Logger()
const compression = require("compression")

if (cluster.isPrimary && String(processMode).toLocaleLowerCase() == "cluster") {

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

} else {

    const session = require("express-session")
    const MongoStore = require('connect-mongo')
    const path = require('path');
    const app = express();
    const server = http.createServer(app)
    const cookieParser = require("cookie-parser")

    const usersController = require("./controllers/users/users.route");
    const panelController = require("./controllers/panel/panel.route")
    const messagesController = require("./controllers/messages/messages.route")
    const productsController = require("./controllers/products/products.route")
    const ordersController = require("./controllers/orders/orders.route");
    const configController = require("./controllers/config/config.route")
    const passport = require("./scripts/passport");

    if (process.env.GZIP == "true") { app.use(compression()); console.log("> GZIP compression enabled") }

    if (argv.mode == undefined) { argv.mode = "development" }

    app.use(logger.logRequest)
    app.use (cookieParser())

    app.use("/", express.static(path.join(__dirname, '/public')))

    const advancedOptions = { useNewUrlParse: true, useUnifiedTopology: true }
    let sessionOptions = {}

    if (process.env.PRODUCTION) {
        sessionOptions = {
            store: MongoStore.create({ mongoUrl: process.env.MONGO_URL, advancedOptions }),
            secret: "marcos123",
            resave: true,
            rolling: true,
            cookie: { maxAge: parseInt(process.env.SESION_DURATION) },
            saveUninitialized: true,
        }
    } else {
        sessionOptions = {
            secret: "marcos123",
            resave: true,
            rolling: true,
            cookie: { maxAge: parseInt(process.env.SESION_DURATION) },
            saveUninitialized: true,
        }
    }

    app.use(session(sessionOptions))
    app.use(express.json())
    app.use(passport.initialize())
    app.use(passport.session())

    app.use((error, req, res, next) => {
        logger.logWarn(req, error)
        console.log (error)
        res.status(500).send(error.message)
    })

    productsController.config(app)
    usersController.config(app)
    panelController.config(app)
    messagesController.config(server)
    ordersController.config(app)
    configController.config(app)
    
    app.use((req, res, next) => {
        logger.logWarn(req)
    })

    start(server)

}

async function start(server) {
    console.log(`> PID ${process.pid}`)
    console.log(`> Server running in ${argv.mode} mode`);

    if (argv.mode == "production") {
        const db = require('./scripts/database');
        try {
            await db.connect();
        } catch (err) {
            console.log(err)
            return
        }
    }

    server.listen(PORT, () => {
        console.log(`> Server running on port ${PORT}`);
    });
};