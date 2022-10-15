require("dotenv").config()
const argv = require('minimist')(process.argv.slice(2));

function getConfig(req, res, next) {
    const data = {env: process.env, args: argv}
    res.render('config', data)
}


module.exports = { getConfig }