function createCard(ID, title, description, image) {
    const card = document.createElement("div")
    card.className = "card"
    card.style = "width: 18rem"

    const img = document.createElement("img")
    img.src = image
    img.class = "card-img-top"
    card.appendChild(img)

    const cardBody = document.createElement("div")
    cardBody.className = "card-body"
    card.appendChild(cardBody)

    const cardTitle = document.createElement("h5")
    cardTitle.className = "card-title"
    cardTitle.setAttribute("_id", ID)
    cardTitle.textContent = title
    cardBody.appendChild(cardTitle)

    const cardText = document.createElement("p")
    cardText.class = "card-text"
    cardText.textContent = "$" + parseFloat(description).toFixed(2).toString()
    cardBody.appendChild(cardText)

    const buyItem = document.createElement("div")
    buyItem.className = "buyItem"
    cardBody.appendChild(buyItem)

    const amount = document.createElement("input")
    amount.type = "Number"
    amount.id = "amount"
    amount.placeholder = "1"
    amount.max = "9"
    amount.min = "1"
    amount.value = "1"
    buyItem.appendChild(amount)

    const buyActionBtn = document.createElement("button")
    buyActionBtn.className = "btn btn-primary"
    buyActionBtn.textContent = "Comprar"
    buyActionBtn.addEventListener("click", buyAction)
    buyItem.appendChild(buyActionBtn)

    return (card)
}