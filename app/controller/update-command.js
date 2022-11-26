const { REST, Routes } = require("discord.js");

exports.updateCommands = async () => {
  const commands = [
    {
      name: "ping",
      description: "Replies with Pong!",
    },
    {
      name: "updatecommand",
      description: "Manually latest sync command!",
    },
    {
      name: "join",
      description: "Join to voice channel",
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
      name: "unpause",
      description: "Unpause and continue music",
    },
    {
      name: "status",
      description: "Show debug informations",
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
