function checkAuthorized(req, res, next){
    (req.user?.level == "admin") ?
        next() : res.redirect("/notAllowed.html")
}

module.exports = { checkAuthorized }