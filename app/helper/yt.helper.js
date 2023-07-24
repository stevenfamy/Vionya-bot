const axios = require("axios");

exports.getTitle = async (vId) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?key=${process.env.YTAPI}&part=snippet&id=${vId}`;
  try {
    const response = await axios.get(url);

    if (response && response.status == 200) {
      const title = response.data.items[0].snippet.title;
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
