
process.on("message", amount => {
    let randomNumbers = {}
    for (let index = 0; index < amount; index++) {
        const rdm = getRandom(1, 1000)
        randomNumbers[rdm] = (randomNumbers[rdm] + 1 || 0)
    }
    process.send(randomNumbers)
    process.exit()
})

function getRandom(max, min) {
    return (Math.floor(Math.random() * (max - min + 1) + min))
}