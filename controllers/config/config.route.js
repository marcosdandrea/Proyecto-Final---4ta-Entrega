const { engine } = require('express-handlebars')
const services = require("./config.services")

function config (app){
    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.get("/config",
        services.getConfig
    )

}

module.exports = { config }