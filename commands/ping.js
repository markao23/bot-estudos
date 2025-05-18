module.exports = {
    name: 'ping',
    description: 'Responde com Pong!',
    aliases: ['p'],
    execute(message, args) { // <--- CORRIGIDO AQUI
        message.channel.send("Pong!");
    }
};