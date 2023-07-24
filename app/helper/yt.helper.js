const { get } = require("axios");
const play = require("play-dl");

exports.getVideoIdMsg = async (search) => {
  let yt_info;
  const isURL = play.yt_validate(search);
  let ytUrl = "";
  let vId = "";
  if (search.startsWith("https") && play.yt_validate(search) === "video") {
    ytUrl = search;
    console.log("getVideoIdMsg", search);
  } else if (play.yt_validate(search) === "search") {
    yt_info = await play.search(search, {
      limit: 1,
    });
    ytUrl = yt_info[0].url;
    console.log("getVideoIdMsg", yt_info[0].url);
  }
  vId = ytUrl.split("?v=")[1];

  return { vId, ytUrl };
};

exports.getTitle = async (vId) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?key=${process.env.YTAPI}&part=snippet&id=${vId}`;
  try {
    const response = await get(url);

    if (response && response.status == 200) {
      const title = response.data.items[0].snippet.title;

      if (!title) return false;

      console.log("getTitle", title);
      return title;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};
