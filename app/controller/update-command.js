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
