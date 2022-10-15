let cart = []

function createCart(cart) {
    if (cart.length == 0) {
        const h3 = document.createElement("h3")
        h3.textContent = "No hay items en el carrito."
        return (h3)
    }
    
    const cartList = document.createElement("ul")
    cartList.className = "list-group list-group-flush"
    
    cart.forEach(item => {
       cartList.appendChild(createItemCart(item))
    });

    const sendCart = document.createElement("button")
    sendCart.className = "btn btn-success"
    sendCart.textContent = "Enviar Pedido"
    sendCart.addEventListener("click", completeOrder);

    cartList.appendChild(sendCart)

    return (cartList)
}

function createItemCart (item){
    const li = document.createElement("li")
    li.className = "list-group-item d-flex justify-content-between align-items-start"

    const cartItem = document.createElement("div")
    cartItem.className = "cartItem"
    li.appendChild(cartItem)

    const img = document.createElement("img")
    img.src = item.productImage
    cartItem.appendChild(img)

    const fwBold = document.createElement("div")
    fwBold.className = "fw-bold"
    fwBold.textContent = item.productName
    cartItem.appendChild(fwBold)

    const cartItemDescription = document.createElement("div")
    cartItemDescription.className = "cartItemDescription"
    const totalPrice = "$" + parseFloat(item.productPrice.slice(1)) * parseInt(item.productAmount)
    cartItemDescription.textContent = "Precio Unitario:" + item.productPrice + "| Total:" + totalPrice
    cartItem.appendChild(cartItemDescription)

    const badge = document.createElement("span")
    badge.className = "badge bg-primary rounded-pill"
    badge.textContent = item.productAmount
    cartItem.appendChild(badge)

    const deleteItem = document.createElement("button")
    deleteItem.className = "deleteItem btn btn-outline-danger"
    deleteItem.type = "button"
    deleteItem.addEventListener("click", ()=>{removeFromCart(item.productID)})
    cartItem.appendChild(deleteItem)

    const deleteIcon = document.createElement("span")
    deleteIcon.className = "material-icons-outlined"
    deleteIcon.textContent = "delete"
    deleteItem.appendChild(deleteIcon)

    return(li)
}

function addToCart(item){
    cart.push(item)
    updateCartItemAmount(cart)
}

function removeFromCart(ID){
    const itemToRemove = cart.findIndex(item => item.productID == ID)
    if (itemToRemove == -1) return
    cart.splice (itemToRemove, 1)
    updateCartItemAmount(cart)
    showCart()
}

function completeOrder(){
    let order = []
    order.push(cart)
    order.push (user)
    const URL = "/orders"
    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'          
        },
        body: JSON.stringify(order)
    })
        .then(res => {
            if(res.status == 200){
                alert ("Su pedido ha sido aceptado")
                cart = []
                updateCartItemAmount(cart)
                showCart()
                return
            }
            if (res.status == 401){
                alert("Su sesión se ha cerrado por inactividad")
                location.replace("/")
                return
            }
        })

        .catch((err) => {
            console.log(err)
        })

}