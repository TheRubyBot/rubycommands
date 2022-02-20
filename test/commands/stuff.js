const { SlashCommand } = require("rubycommands")

module.exports = new SlashCommand("test", "This is a description", [], ({ interaction: i, client }) => {
  i.reply("Hello World")
})
