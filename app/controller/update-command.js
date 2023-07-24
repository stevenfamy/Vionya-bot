const { REST, Routes } = require("discord.js");

exports.updateCommands = async () => {
  const commands = [
    {
      name: "ping",
      description: "Replies with Pong!",
    },
    {
      name: "sync",
      description: "Manually latest sync command!",
    },
    {
      name: "join",
      description: "Join to voice channel",
    },
    {
      name: "status",
      description: "Console.log voice status to server",
    },
    {
      name: "leave",
      description: "Join to voice channel",
    },
    {
      name: "play",
      description: "Play something",
      options: [
        {
          type: 3,
          name: "keywords",
          description: "Keywords",
          required: true,
        },
      ],
    },
    {
      name: "stop",
      description: "Stop all music",
    },
    {
      name: "pause",
      description: "Pause current music",
    },
    {
      name: "resume",
      description: "Resume music",
    },
    {
      name: "nowplaying",
      description: "Show current now playing and next queue",
    },
    {
      name: "add",
      description: "Add song to queue.",
      options: [
        {
          type: 3,
          name: "keywords",
          description: "Keywords",
          required: true,
        },
      ],
    },
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENTID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
