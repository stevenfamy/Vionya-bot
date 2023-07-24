require("dotenv").config();
const util = require("util");
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
const { getTitle, getVideoIdMsg } = require("../helper/yt.helper");
const {
  addQueue,
  getQueueUnplayed,
  getQueueOldest,
  updateQueueStatus,
  queueCleaner,
} = require("../helper/queue.helper");

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
  // console.log("Init Join Voice Channel", currentVoiceChannel);
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

exports.musicResume = async () => {
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

    let yt_info;
    const isURL = play.yt_validate(search);

    const { vId, ytUrl } = await getVideoIdMsg(search);

    console.log("Video Id", vId);

    this.playStream(ytUrl);

    return "";
  } catch (e) {
    console.log(e);
  }
};

exports.nowPlaying = async (msg) => {
  try {
    if (!audioPlayer) return false;
    const videoTitle = await getTitle(currentVid);
    if (videoTitle) return `Currently I'm playing "${videoTitle}"`;
    if (!videoTitle) return false;
  } catch (e) {
    console.log(e);
  }
};

exports.addNewQueue = async (msg, search, currentVoiceChannel, userId) => {
  try {
    console.log(msg);
    if (!audioPlayer) {
      const res = await this.doJoinVoice(msg, currentVoiceChannel, true);
      if (res != true) {
        return res;
      }
    }

    const { vId, ytUrl } = await getVideoIdMsg(search);
    const title = await getTitle(vId);

    if (!title) return "Not Found";

    const result = await addQueue(
      vId,
      title,
      userId,
      currentVoiceChannel.id,
      msg.channelId
    );

    return result
      ? `${title} (${ytUrl}) is added to queue.`
      : "Failed to add queue.";
  } catch (e) {
    console.error(e);
  }
};

exports.getPlayerStats = async () => {
  const playerStatus = audioPlayer?._state.status;
  console.log("Player stats:", playerStatus);
  return playerStatus;
};

triggerPlaylist = async () => {
  if ((await this.getPlayerStats()) == "idle") {
    const unplayedCount = await getQueueUnplayed();
    console.log("unplayedCount", unplayedCount);

    if (unplayedCount <= 0) return false;

    const nextTrack = await getQueueOldest();

    if (!nextTrack) return false;

    this.playStream(
      `https://www.youtube.com/watch?v=${nextTrack.video_id}`,
      nextTrack
    );

    updateQueueStatus(nextTrack.id);
    queueCleaner();
  }
};

exports.playStream = async (ytUrl, nextTrack) => {
  let stream;
  stream = await play.stream(ytUrl);
  let resource = createAudioResource(stream.stream, {
    inputType: stream.type,
    inlineVolume: true,
  });
  resource.volume.setVolume(0.5);
  audioPlayer.play(resource);

  const channel = client.channels.cache.get(nextTrack.msg_channel_id);
  currentVid = nextTrack.video_id;
  channel.send(
    `I'm playing queue "${nextTrack.title}" (https://www.youtube.com/watch?v=${nextTrack.video_id})`
  );
  // console.log(audioPlayer, { maxArrayLength: null });
  // console.log(util.inspect(audioPlayer, false, null, true /* enable colors */));
};

setInterval(function () {
  triggerPlaylist();
}, 1000);
