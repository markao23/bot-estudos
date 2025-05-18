const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
require("dotenv").config();

const prefix = "!";
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

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

  if (message.author.bot) {
    console.log("Mensagem ignorada: autor é um bot.");
    return;
  }

  if (!message.content.startsWith(prefix)) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  console.log(`Comando recebido: "${command}", Argumentos: ${args.join(', ')}`); // Log do comando

  if (command === "ping") {
    console.log("Executando comando PING");
    message.reply("Pong!");
  } else if (command === "hello") {
    console.log("Executando comando HELLO");
    message.reply(`Ola ${message.author.username}`);
  } else {
    console.log(`Comando "${command}" não reconhecido.`);
  }
});
client.login(process.env.TOKEN).catch((err) => { // << MUDE TOKEN_DO_SEU_ARQUIVO_ENV
  console.error("Erro ao fazer login:", err);
  console.error(
    "Verifique se o seu token no arquivo .env está correto (com o nome certo!) e se as Intents necessárias estão ativadas no portal do desenvolvedor."
  );
});