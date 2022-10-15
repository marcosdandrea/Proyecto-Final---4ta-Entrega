const services = require("./products.services")

function config(app){
    app.post("/products", 
        services.checkAuthorized,
        services.uploader.single("image"),
        services.saveNewProduct
    )

    app.get('/products',
        services.checkAuthorized,
        services.getAllProducts
    )
}


module.exports = {config}