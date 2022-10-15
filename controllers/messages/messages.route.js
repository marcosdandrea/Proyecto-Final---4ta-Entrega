const { Server: ServerIO } = require("socket.io");
const services = require("./messages.services")


/**
 * 
 * @param {http server} server 
 */
function config (server){

    const io = new ServerIO(server);

    io.on('connection', (socket) => {
        console.log('> cliente de chat conectado: ' + socket.id);
        services.sendAllMessages();

        socket.on("newMessage", async (message)=> {
            await services.newMessage(message)
            await services.sendAllMessages(socket)
        })
    });

}

module.exports = { config }