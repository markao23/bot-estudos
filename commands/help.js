const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Lista todos os comandos disponíveis ou informações sobre um comando específico.',
    aliases: ['ajuda', 'comandos'],
    execute(message, args, client){
        const { commands } = message.client
        if (!args.length) {
            const helpEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('📄 Lista de comandos')
                .setDescription('Aqui vao listar todos os comandos que você possa usar ')
                .setTimestamp()
                .setFooter({ text: 'Use `!help <comando>` pra mais detalhes '})

            commands.forEach(command => {
                if (command.name && command.description) {
                    helpEmbed.addFields({ name: `\`!${command.name}\``, value: command.description, inline: false });
                } else if( command.name ) {
                    helpEmbed.addFields({ name: `\`!${command.name}\``, value: 'Sem descrição disponível.', inline: false });
                }
            });
            return message.channel.send({ embeds: [helpEmbed] })
        } else {
            const commandName = args[0].toLowerCase()
            const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.include(commandName))

            if (!command) {
                return message.reply('Esse comando nao existe')
            }
            const commandEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`🔎 Detalhes do Comando: \`!${command.name}\``)
                .setTimestamp();
            
            if (command.description) {
                commandEmbed.setDescription(command.description);
            }
            if (command.aliases) {
                commandEmbed.addFields({ name: 'Apelidos', value: command.aliases.join(', '), inline: true });
            }
            if (command.usage) {
                commandEmbed.addFields({ name: 'Como usar', value: `\`!${command.name} ${command.usage}\``, inline: true });
            }
            return message.channel.send({ embeds: [commandEmbed] });
        }
    } 
}