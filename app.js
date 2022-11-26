require("dotenv").config();
const { Client, GuildMember, GatewayIntentBits } = require("discord.js");
const { messageControl } = require("./app/controller/message-control");
const { updateCommands } = require("./app/controller/update-command");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.on("ready", async () => {
  client.user.setStatus("online");
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
  try {
    if (msg.author.id == process.env.CLIENTID) return null;

    const User = await client.users.fetch(msg.author);
    const guild = await client.guilds.cache.get(msg.guildId);
    const member = await guild.members.fetch(User.id);
    const currentVoiceChannel = member.voice.channel?.id
      ? await client.channels.fetch(member.voice.channel.id)
      : null;

    const result = await messageControl(msg, currentVoiceChannel);
    result != null ? msg.reply(result) : null;
  } catch (e) {
    console.log(e);
  }
});

// client.on("ready", () => {
//   console.log(client);
//   // if (!channel) return console.error("The channel does not exist!");

//   joinVoiceChannel({
//     channelId: channel.id,
//     guildId: channel.guild.id,
//     adapterCreator: channel.guild.voiceAdapterCreator,
//   });
// });

client.login(process.env.TOKEN);
