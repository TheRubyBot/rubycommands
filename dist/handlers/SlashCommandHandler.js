var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var import_SlashCommand = require("../constructors/SlashCommand");
var import_readDir = require("../util/readDir");
var import_rest = require("@discordjs/rest");
var import_v10 = require("discord-api-types/v10");
class SlashCommandHandler {
  constructor(i, client, slashPreExec, slashPostExec) {
    this.commands = /* @__PURE__ */ new Map();
    this.preExec = slashPreExec;
    this.postExec = slashPostExec;
    const files = (0, import_readDir.readDir)(i.commandsDir, { ignoreDot: true });
    this.registerCommands(files, client, i);
  }
  registerCommands(files, client, i) {
    return __async(this, null, function* () {
      for (const file of files) {
        let slashCommand = yield import(file);
        if (slashCommand.default)
          slashCommand = slashCommand.default;
        else if (slashCommand.command)
          slashCommand = slashCommand.command;
        if (!(slashCommand instanceof import_SlashCommand.SlashCommand))
          throw new Error(`${file} is not a valid slash command
TIP: Prefix files with a period (.) to ignore them`);
        this.commands.set(slashCommand.name, slashCommand);
      }
      const configs = Array.from(this.commands.values()).map(({ name, description, options, type }) => ({ name, description, options, type }));
      const rest = new import_rest.REST({ version: "10" }).setToken(client.token);
      try {
        if (i.globalTest && i.testServers) {
          for (const server of i.testServers) {
            this.registerSlashCommands(rest, configs, client, server);
          }
        } else {
          this.registerSlashCommands(rest, configs, client);
        }
      } catch (e) {
        throw new Error(e);
      }
      client.on("interactionCreate", (i2) => {
        if (!i2.isApplicationCommand())
          return;
        const command = this.commands.get(i2.commandName);
        if (!command)
          return;
        if (this.preExec)
          this.preExec();
        command.callback({ interaction: i2, client });
        if (this.postExec)
          this.postExec();
      });
    });
  }
  registerSlashCommands(rest, configs, client, serverID) {
    return __async(this, null, function* () {
      if (serverID)
        yield rest.put(import_v10.Routes.applicationGuildCommands(client.user.id, serverID), { body: configs });
      else
        yield rest.put(import_v10.Routes.applicationCommands(client.user.id), { body: configs });
    });
  }
}
module.exports = SlashCommandHandler;
