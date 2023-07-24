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
const { getTitle } = require("../helper/yt.helper");
let audioPlayer;
let currentVid = "";

play.setToken({
  youtube: {
    cookie: process.env.YTCOOKIES,
  },
});

exports.doJoinVoice = async (msg, currentVoiceChannel, command = false) => {
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
      });

      audioPlayer = createAudioPlayer();
      connection.subscribe(audioPlayer);

      return command ? true : `Joining channel **${currentVoiceChannel.name}**`;
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
    audioPlayer.stop();
    currentVid = "";
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
  if (!audioPlayer) return false;
  try {
    audioPlayer.stop();
    currentVid = "";
    return true;
  } catch (e) {
    console.log(e);
  }
};

exports.musicPause = async () => {
  if (!audioPlayer) return false;
  try {
    audioPlayer.pause();
    return true;
  } catch (e) {
    console.log(e);
  }
};

exports.musicUnpause = async () => {
  if (!audioPlayer) return false;
  try {
    audioPlayer.unpause();
    return true;
  } catch (e) {
    console.log(e);
  }
};

exports.playTube = async (msg, search, currentVoiceChannel) => {
  try {
    if (!audioPlayer) {
      const res = await this.doJoinVoice(msg, currentVoiceChannel, true);
      if (res != true) {
        return res;
      }
    }
    console.log("arg", search);
    let stream;
    let yt_info;
    const isURL = play.yt_validate(search);
    let ytUrl = "";
    let vId = "";
    if (search.startsWith("https") && play.yt_validate(search) === "video") {
      ytUrl = search;
      console.log("start", search);
    } else if (play.yt_validate(search) === "search") {
      yt_info = await play.search(search, {
        limit: 1,
      });
      ytUrl = yt_info[0].url;
      console.log("start", yt_info[0].url);
    }
    vId = ytUrl.split("?v=")[1];
    currentVid = vId;
    console.log("Video Id", vId);
    stream = await play.stream(ytUrl);
    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
      inlineVolume: true,
    });
    resource.volume.setVolume(0.5);
    audioPlayer.play(resource);

    return isURL === "video" && search.startsWith("https")
      ? `I'm playing "${search}"`
      : `I'm playing "${search}" from ${yt_info[0].url}`;
  } catch (e) {
    console.log(e);
  }
};

exports.nowPlaying = async (msg) => {
  try {
    if (!audioPlayer) return false;
    const videoTitle = await getTitle(currentVid);
    if (videoTitle) return `Currently I'm playing "${videoTitle}"`;
    if (!videoTitle) return "Error, please contact .cainx";
  } catch (e) {
    console.log(e);
  }
};
