require("dotenv").config()
const crypto = require("crypto")
let memory = []

async function saveNewProduct(productObject) {
    console.log ("Saving new product")
    productObject.productID = crypto.randomUUID() 
    memory.push (productObject)
    return (productObject.productID)
}

async function getAllProducts() {
    return (memory)
}

module.exports = { getAllProducts, saveNewProduct }