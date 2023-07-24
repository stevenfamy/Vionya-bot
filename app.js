require("dotenv").config();

const {
  Client,
  GuildMember,
  GatewayIntentBits,
  Events,
} = require("discord.js");
const {
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  generateDependencyReport,
  StreamType,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");

const { commandControl } = require("./app/controller/command-control");
const { messageControl } = require("./app/controller/message-control");
let clientVoice = require("./app/controller/voice");

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

let clientReady = false;

client.on("ready", async () => {
  client.user.setStatus("online");
  console.log(`Logged in as ${client.user.tag}!`);
  clientReady = true;
});

client.on("interactionCreate", async (interaction) => {
  try {
    // const User = await client.users.fetch(interaction.user);
    // const guild = await client.guilds.cache.get(interaction.guildId);
    // const member = await guild.members.fetch(User.id);
    // const currentVoiceChannel = member.voice.channel?.id
    //   ? await client.channels.fetch(member.voice.channel.id)
    //   : null;

    const currentVoiceChannel = await getCurrentVoiceChannel(
      interaction,
      interaction.user
    );
    await commandControl(interaction, currentVoiceChannel);
  } catch (e) {
    console.log(e);
  }
});

client.on("messageCreate", async (msg) => {
  try {
    if (msg.author.id == process.env.CLIENTID) return null;

    // const User = await client.users.fetch(msg.author);
    // const guild = await client.guilds.cache.get(msg.guildId);
    // const member = await guild.members.fetch(User.id);
    // const currentVoiceChannel = member.voice.channel?.id
    //   ? await client.channels.fetch(member.voice.channel.id)
    //   : null;

    const currentVoiceChannel = await getCurrentVoiceChannel(msg, msg.author);

    const result = await messageControl(msg, currentVoiceChannel);
    result != null ? msg.reply(result) : null;
  } catch (e) {
    console.log(e);
  }
});

client.login(process.env.TOKEN);

const getCurrentVoiceChannel = async (connection, user) => {
  const User = await client.users.fetch(user);
  const guild = await client.guilds.cache.get(connection.guildId);
  const member = await guild.members.fetch(User.id);
  const currentVoiceChannel = member.voice.channel?.id
    ? await client.channels.fetch(member.voice.channel.id)
    : null;

  return currentVoiceChannel;
};

// var myInt = setInterval(function () {
//   if (clientReady) {
//     console.log(client.user);
//   }
// }, 1000);
