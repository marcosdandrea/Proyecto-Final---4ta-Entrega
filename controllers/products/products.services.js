const multer = require("multer");
const factory = require("./products.DAO.Factory")
const Loguer = require("../../scripts/Logger")
const argv = require('minimist')(process.argv.slice(2));
const DAO = factory(argv.mode)
const logger = new Loguer()

const storage = multer.diskStorage({
    destination: "public/images/products",
    filename: (req, file, cb) => {
        const filename = file.originalname;
        cb(null, filename)
    }
})

const uploader = multer({ storage: storage })

async function getAllProducts(req, res, next) {
    let ans = undefined
    try{
        ans = await DAO.getAllProducts()
        res.send(ans)
    }catch(err){
        logger.logError(err.message)
        res.status(400).send(err)
    }
}


async function saveNewProduct(req, res, next) {
    let ans = undefined
    try{
        const { file } = req;
        const title = req.query.title || req.body.title
        const price = parseFloat(req.query.price) || parseFloat(req.body.price)
        const imgDir = "../images/products/"
        const image = imgDir + file.filename
        const newProduct = { title, price, image }
        ans = await DAO.saveNewProduct(newProduct)
        res.send(ans)
    }catch(err){
        logger.logError(`${err.message} - url:${req.url} method:${req.method}`)
        res.status(400).send(err)
    }
}

function checkAuthorized(req, res, next) {
    if (req.user?.level == "admin" || req.user?.level == "user") {
        console.log(">> usuario autorizado")
        next()
    } else {
        logger.logWarn ("error", "Acceso no autorizado")
        console.log(">> usuario no autorizado")
        res.status(401)
        res.send("Acceso denegado")
    }
}

module.exports = {uploader, getAllProducts, saveNewProduct, checkAuthorized}