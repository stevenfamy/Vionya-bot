require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { updateCommands } = require("./app/controller/update-command");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }

  if (interaction.commandName === "updatecommand") {
    await updateCommands();
    await interaction.reply("✅ Command Synched!");
  }
});

client.on("messageCreate", async (msg) => {
  if (
    msg.content.toLocaleLowerCase().includes("bot") &&
    msg.content.toLocaleLowerCase().includes("hey")
  ) {
    msg.reply("Sup");
  }

  if (msg.content.toLocaleLowerCase().includes("ping")) {
    msg.reply("Pong!");
  }
});

client.login(process.env.TOKEN);
