const services = require("./panel.services.js")

function config (app){ 
    
    app.get ("/panel",
        services.checkAuthorized
    )

}

module.exports = { config }