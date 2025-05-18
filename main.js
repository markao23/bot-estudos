const { Client, GatewayIntentBits, ActivityType, Collection } = require("discord.js");
const fs = require("node:fs")
const path = require("node:path")
require("dotenv").config();

const prefix = "!";
const commandPath = path.join(__dirname, "command")
client.commands = new Collection();

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

if (fs.existsSync(commandPath)) {
  const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'))
  for(const file of commandFiles){
    const filePath = path.join(commandFiles, file)
    try {
      const command = require(filePath)
      if ('name' in command && 'execute' in command) {
        client.commands.set(command.name, command)
        console.log(`Comando carregado ${command.name}`);
      } else {
        console.log(`[AVISO] O comando em ${filePath} está faltando uma propriedade "name" ou "execute" obrigatória.`);
      }
    } catch (error) {
      console.error(`[ERRO] Não foi possível carregar o comando em ${filePath}:`, error);
    }
  }
} else {
  console.warn("[AVISO] A pasta 'commands' não foi encontrada. Nenhum comando será carregado.");
}

client.on("ready", () => {
  console.log("-------------------------------------------------------");
  console.log(" bot logado com sucesso");
  console.log("-------------------------------------------------------");

  client.user.setActivity("Digite !help <comando> pra mais detalhes", {
    type: ActivityType.Playing
  })
});

client.on("messageCreate", async (message) => {
  console.log(`Nova mensagem de ${message.author.tag}: "${message.content}"`); // Log da mensagem

  if (message.author.bot || !message.content.startsWith(prefix)) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || 
                  client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) {
    message.reply(`Desculpe o comando ${commandName} nao esiste`)
    return
  }

  try {
    await command.execute(message, args)
  } catch (error) {
    console.error(`Erro ao executar o comando ${commandName}:`, error);
    message.reply('Ocorreu um erro ao tentar executar esse comando!');
  }
  
});
client.login(process.env.TOKEN).catch((err) => { // << MUDE TOKEN_DO_SEU_ARQUIVO_ENV
  console.error("Erro ao fazer login:", err);
  console.error(
    "Verifique se o seu token no arquivo .env está correto (com o nome certo!) e se as Intents necessárias estão ativadas no portal do desenvolvedor."
  );
});