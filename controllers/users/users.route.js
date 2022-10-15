const services = require ("./users.services.js")

function config (app){ 

    app.post ("/auth/register",
        services.uploader.single ("profilePic"),
        services.passport.authenticate("registration", { session: true }),
        services.signInSuccess,
        services.loginSuccess
    )

    app.post ("/auth/login",
        services.passport.authenticate("login", { session: true }),
        services.loginSuccess
    )

    app.post ("/auth/logout",
        services.closeSession
    )
}

module.exports = { config }