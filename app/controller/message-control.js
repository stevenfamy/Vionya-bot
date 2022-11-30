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
  nowPlaying,
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
  } else if (args[1].toLowerCase() === "nowplaying") {
    const res = await nowPlaying(msg);
    reply = res ? res : "Sorry, Currently nothing is playing.";
  } else if (args[1].toLowerCase() === "help") {
    reply = `**Command List:** 
    **vy ping** -> Reply with Pong!
    **vy sync** -> Sync slash command with server!
    **vy join** -> Join to your voice channel
    **vy leave** -> Leave the voice channel
    **vy play keywords/url** -> Play song from YT using search or URL
    **vy stop** -> Stop current song
    **vy pause** -> Pause current song
    **vy unpause** -> Resume current song
    **vy status** -> Show debug info
    **vy about** -> Show Bot info
    
    Or you can use slash command (/)
    `;
  }
  //   } else if (args[1].toLowerCase() === "about") {
  //     reply = `**Viona**
  //     Creator: cainx#6666 | steve.mailme@gmail.com
  //     Sourcecode: https://github.com/stevenfamy/Vionya-bot
  //     `;
  //   }

  return reply;
};
