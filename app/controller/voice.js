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
const play = require("play-dl");
let audioPlayer;

exports.doJoinVoice = async (msg, currentVoiceChannel) => {
  if (!currentVoiceChannel) return "Sorry, you're not in a **voice channel**.";
  //   console.log(generateDependencyReport());
  console.log("Init Join Voice Channel", currentVoiceChannel);
  try {
    const connection = getVoiceConnection(currentVoiceChannel.guild.id);
    if (!connection) {
      const connection = joinVoiceChannel({
        channelId: currentVoiceChannel.id,
        guildId: currentVoiceChannel.guild.id,
        adapterCreator: currentVoiceChannel.guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: false,
        debug: true,
      });

      audioPlayer = createAudioPlayer();
      connection.subscribe(audioPlayer);

      return `Joining channel **${currentVoiceChannel.name}**`;
    } else {
      console.log("Connection", connection.joinConfig);
      if (
        currentVoiceChannel.guild.id == connection.joinConfig.guildId &&
        currentVoiceChannel.id != connection.joinConfig.channelId
      ) {
        return "Sorry, currently i'm singing in other voice channel.";
      } else if (
        currentVoiceChannel.guild.id == connection.joinConfig.guildId &&
        currentVoiceChannel.id == connection.joinConfig.channelId
      ) {
        return "I'm already inside your voice channel.";
      }
    }
  } catch (e) {
    console.log(e);
  }
};

exports.showVoiceStatus = async (msg) => {
  try {
    const connection = getVoiceConnection(msg.guildId);
    if (connection) {
      console.log("connection", connection);
      console.log("status", connection._state.status);
    }
    //   console.log("debug", connection.debug);
  } catch (e) {
    console.log(e);
  }
};

exports.leaveVoice = async (msg) => {
  try {
    const connection = getVoiceConnection(msg.guildId);
    if (connection) connection.destroy();
  } catch (e) {
    console.log(e);
  }
};

exports.playLocal = async () => {
  try {
    const resource = createAudioResource("./files/1.mp3");
    audioPlayer.play(resource);
  } catch (e) {
    console.log(e);
  }
};

exports.musicStop = async () => {
  try {
    audioPlayer.stop();
  } catch (e) {
    console.log(e);
  }
};

exports.musicPause = async () => {
  try {
    audioPlayer.pause();
  } catch (e) {
    console.log(e);
  }
};

exports.musicUnpause = async () => {
  try {
    audioPlayer.unpause();
  } catch (e) {
    console.log(e);
  }
};

exports.playTube = async (msg, search) => {
  try {
    console.log("arg", search);
    let yt_info = await play.search(search, {
      limit: 1,
    });

    let stream = await play.stream(yt_info[0].url);
    console.log("start", yt_info[0].url);
    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    audioPlayer.play(resource);

    return `I'm playing "${search}" from ${yt_info[0].url}`;
  } catch (e) {
    console.log(e);
  }
};
