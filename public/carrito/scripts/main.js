
const URL = "/auth/getUserData"
const loading = document.querySelector(".loading")
let currentView = undefined
let user 

document.addEventListener("DOMContentLoaded", () => {
    checkSession()
    document.querySelector("#productsView").addEventListener("click", () => showProducts())
    document.querySelector("#cartView").addEventListener("click", () => showCart())
    document.querySelector("#btnLogout").addEventListener("click", () => logout())
    showProducts()
    updateCartItemAmount([])
})

function checkSession() {
    user = JSON.parse(getCookie("user", false))
    user.profilePic = "/images/profiles/" + user.profilePic
    const welcomeMsg = user.alias
    document.querySelector("#username").textContent = welcomeMsg.toUpperCase()
    document.querySelector("#userPic").src = user.profilePic

    const check = setInterval(() => {
        const thisSession = getCookie("connect.sids", true)
        if (!thisSession) {
            clearInterval(check)
            alert("Su sesión se ha cerrado por inactividad")
            location.replace("/")
        }
    }, 5000)
}

function getCookie(cname, raw) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    if (!raw)
        return "";
    return decodedCookie
}

function showCart(update) {
    if (currentView=="cart" && update == false) return
    currentView = "cart"
    const cartView = document.querySelector("#cartView")
    const productsView = document.querySelector("#productsView")
    cartView.classList.add("link-primary")
    productsView.classList.add("link-secondary")
    cartView.classList.remove("link-secondary")
    productsView.classList.remove("link-primary")

    const itemsContainer = document.querySelector(".itemsContainer")
    itemsContainer.innerHTML = ""

    itemsContainer.appendChild (createCart(cart))

}

function showProducts() {
    if (currentView=="productos") return
    loading.style.display = "flex"
    currentView = "productos"
    const cartView = document.querySelector("#cartView")
    const productsView = document.querySelector("#productsView")
    productsView.classList.add("link-primary")
    cartView.classList.add("link-secondary")
    productsView.classList.remove("link-secondary")
    cartView.classList.remove("link-primary")

    getAllProducts()
        .catch(err => {
            alert("Su sesión se ha cerrado por inactividad")
            location.replace("/")
            return
        })
        .then(products => {
            spawnProducts(products)
            loading.style.display = "none"
        })
}

function getAllProducts() {
    return new Promise(async (resolve, reject) => {
        const URL = "/products"
        try {
            const res = await fetch(URL, { method: 'GET' })
            if (res.status == 401) reject("Sesión cerrada")
            const parsed = await res.json()
            resolve(parsed)
        } catch (err) {
            reject(err)
        }
    })
}

function spawnProducts(products) {
    const itemsContainer = document.querySelector(".itemsContainer")
    itemsContainer.innerHTML = ""
    products.forEach(product => {
        const newCard = createCard(product._id, product.title, product.price, product.image)
        itemsContainer.appendChild(newCard)
    });
}

function logout() {
    const URL = "/auth/logout"
    fetch(URL, {
        method: 'POST'
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(function (err) {
            console.info(err + " url: " + url);
        });
}

function updateCartItemAmount(cart){
    const cartItemAmount = document.querySelector("#cartItemAmount")
    cartLength = cart.length

    if (cartLength == 0){
        cartItemAmount.classList.add("hidden")
        return
    }
    cartItemAmount.classList.remove("hidden")

    let realCartAmount = cart.reduce((acc, curr) => 
        acc + parseInt(curr.productAmount)
    , 0)

    cartItemAmount.textContent = realCartAmount
}

function buyAction(event){
    const card = event.target.parentNode.parentNode.parentNode
    const productName = card.querySelector(".card-title").textContent
    const productID = card.querySelector(".card-title").getAttribute("_id")
    const productImage = card.querySelector("img").src
    const productPrice = card.querySelector("p").textContent
    const productAmount = card.querySelector("input").value

    const newItem = {productID, productName, productPrice, productAmount, productImage}
    addToCart(newItem)
    
}