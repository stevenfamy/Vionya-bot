const { updateCommands } = require("./update-command");
const {
  doJoinVoice,
  showVoiceStatus,
  leaveVoice,
  playLocal,
  musicPause,
  musicStop,
  musicResume,
  playTube,
  nowPlaying,
  addNewQueue,
} = require("./voice");

exports.commandControl = async (interaction, currentVoiceChannel) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (interaction.commandName === "sync") {
    await updateCommands();
    await interaction.reply("Ok, Command successfully synched!");
  } else if (interaction.commandName === "join") {
    await interaction.reply(
      await doJoinVoice(interaction, currentVoiceChannel)
    );
  } else if (interaction.commandName === "status") {
    await showVoiceStatus(interaction);
    await interaction.reply(".");
  } else if (interaction.commandName === "leave") {
    await musicStop(interaction);
    await leaveVoice(interaction);
    await interaction.reply("We'll have a talk again later, bye");
  } else if (interaction.commandName === "play") {
    const keyword = interaction.options.getString("keywords").trim();
    await interaction.reply(
      await playTube(interaction, keyword, currentVoiceChannel)
    );
  } else if (interaction.commandName === "stop") {
    const res = await musicStop(interaction);
    await interaction.reply(
      res ? "Music stopped" : "Sorry, nothing can be stopped."
    );
  } else if (interaction.commandName === "pause") {
    const res = await musicPause(interaction);
    await interaction.reply(
      res ? "Music paused" : "Sorry, nothing can be paused."
    );
  } else if (interaction.commandName === "resume") {
    const res = await musicResume(interaction);
    await interaction.reply(
      res ? "Music resumed" : "Sorry, nothing can be resumed."
    );
  } else if (interaction.commandName === "nowplaying") {
    const res = await nowPlaying(interaction);
    await interaction.reply(res ? res : "Sorry, Currently nothing is playing.");
  } else if (interaction.commandName === "add") {
    const keyword = interaction.options.getString("keywords").trim();
    await interaction.reply(
      await addNewQueue(
        interaction,
        keyword,
        currentVoiceChannel,
        interaction.user.id
      )
    );
  }
};
