const services = require ("./orders.services.js")

function config (app){ 
    app.post ("/orders",
        services.checkAuthorized,
        services.newOrder
        )
}

module.exports = {config}