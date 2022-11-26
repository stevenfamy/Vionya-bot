const { updateCommands } = require("./update-command");
const {
  doJoinVoice,
  showVoiceStatus,
  leaveVoice,
  playLocal,
  musicPause,
  musicStop,
  musicUnpause,
  playTube,
} = require("./voice");
const prefix = "vy";

exports.messageControl = async (msg, currentVoiceChannel) => {
  if (msg.author.id == process.env.CLIENTID) return;
  let args = msg.content.slice(prefix.length).split(" ");
  if (!msg.content.startsWith(prefix)) return;
  console.log(args);
  let reply = null;

  if (args[1].toLowerCase() === "ping") {
    reply = "Pong!";
  } else if (args[1].toLowerCase() === "sync") {
    await updateCommands();
    reply = "Ok, Command successfully synched!";
  } else if (args[1].toLowerCase() === "join") {
    reply = await doJoinVoice(msg, currentVoiceChannel);
  } else if (args[1].toLowerCase() === "status") {
    await showVoiceStatus(msg);
    // reply = "✅ Command Synched!";
  } else if (args[1].toLowerCase() === "leave") {
    await musicStop(msg);
    await leaveVoice(msg);
    reply = "We'll have a talk again later, bye";
  } else if (args[1].toLowerCase() === "play") {
    if (args[2].toLowerCase() === "special") {
      await playLocal(msg);
    } else {
      const keyword = msg.content.slice(prefix.length).split("play")[1].trim();
      reply = await playTube(msg, keyword, currentVoiceChannel);
    }
  } else if (args[1].toLowerCase() === "stop") {
    const res = await musicStop(msg);
    reply = res ? "Music stopped" : "Sorry, nothing can be stopped.";
  } else if (args[1].toLowerCase() === "pause") {
    const res = await musicPause(msg);
    reply = res ? "Music paused" : "Sorry, nothing can be paused.";
  } else if (args[1].toLowerCase() === "unpause") {
    const res = await musicUnpause(msg);
    reply = res ? "Music resumed" : "Sorry, nothing can be resumed.";
  }

  return reply;
};
