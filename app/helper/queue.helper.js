const db = require("../models");
const Queue = db.queue;

exports.addQueue = async (
  videoId,
  title,
  userId,
  voiceChannelId,
  msgChannelId
) => {
  try {
    const result = await Queue.create({
      video_id: videoId,
      user_id: userId,
      voice_channel_id: voiceChannelId,
      msg_channel_id: msgChannelId,
      added_on: Math.floor(new Date().getTime() / 1000),
      status: 0,
      title: title,
    });

    if (result.id) return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.getQueueUnplayed = async () => {
  try {
    const result = await Queue.count({
      where: {
        status: 0,
      },
    });

    return result;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.getQueueOldest = async () => {
  try {
    const result = await Queue.findOne({
      where: {
        status: 0,
      },
      order: [["added_on", "asc"]],
      attributes: ["id", "video_id", "title", "msg_channel_id"],
    });

    return result;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.updateQueueStatus = async (queueId) => {
  try {
    const result = await Queue.update(
      { status: 1 },
      {
        where: {
          id: queueId,
        },
      }
    );

    return result;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.queueCleaner = async () => {
  try {
    const result = await Queue.destroy({
      where: {
        status: 1,
      },
    });

    return result ? true : false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.getQueueCount = async () => {};
exports.getQueueList = async () => {};
