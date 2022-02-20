require("dotenv").config();
const { Client } = require("discord.js")
const { RubyCommands } = require("rubycommands")

const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"]
});

client.on("ready", () => {
  console.log("Ready")

  const rubyCommands = new RubyCommands(client, {
    commandsDir: "commands",
    eventsDir: "events",
    preExec() {
      console.log("Before the command")
    },
    postExec() {
      console.log("After the commadn")
    }
  });

  console.log(rubyCommands)
})

client.login(process.env["TOKEN"])
