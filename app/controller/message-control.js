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
  if (msg.author.id == process.env.CLIENTID) return null;
  let reply = null;

  if (
    msg.content.toLocaleLowerCase().includes("bot") &&
    msg.content.toLocaleLowerCase().includes("hey")
  ) {
    reply = "Sup";
  } else if (msg.content.toLocaleLowerCase().includes("ping")) {
    reply = "おいしい";
  } else if (msg.content.toLocaleLowerCase() == `${prefix} sync`) {
    await updateCommands();
    reply = "✅ Command Synched!";
  } else if (msg.content.toLocaleLowerCase() == `${prefix} join`) {
    reply = await doJoinVoice(msg, currentVoiceChannel);
  } else if (msg.content.toLocaleLowerCase() == `${prefix} status`) {
    await showVoiceStatus(msg);
    // reply = "✅ Command Synched!";
  } else if (msg.content.toLocaleLowerCase() == `${prefix} leave`) {
    await musicStop(msg);
    await leaveVoice(msg);
    reply = "後でまた話しましょう、さようなら。";
  } else if (msg.content.toLocaleLowerCase() == `${prefix} play local`) {
    await playLocal(msg);
    // reply = "✅ Command Synched!";
  } else if (msg.content.toLocaleLowerCase() == `${prefix} stop`) {
    await musicStop(msg);
    reply = "音楽が止まった。";
  } else if (msg.content.toLocaleLowerCase() == `${prefix} pause`) {
    await musicPause(msg);
    reply = "音楽を一時停止しました。";
  } else if (msg.content.toLocaleLowerCase() == `${prefix} unpause`) {
    await musicUnpause(msg);
    reply = "音楽再開。";
  } else if (msg.content.toLocaleLowerCase().includes(`${prefix} `)) {
    const temp = msg.content.split("vy");
    reply = await playTube(msg, temp[1].trim());
  }

  return reply;
};
