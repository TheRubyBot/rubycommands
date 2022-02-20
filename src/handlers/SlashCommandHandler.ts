import type { Client } from "discord.js";
import type { RubyCommands, func } from "..";
import { SlashCommand } from "../constructors/SlashCommand"
import { readDir } from "../util/readDir"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v10"

class SlashCommandHandler {
  public commands: Map<string, SlashCommand> = new Map();
  public preExec: func | undefined;
  public postExec: func | undefined

  constructor(i: RubyCommands, client: Client, slashPreExec: func | undefined, slashPostExec: func | undefined) {
    this.preExec = slashPreExec
    this.postExec = slashPostExec

    const files = readDir(i.commandsDir, { ignoreDot: true })
    this.registerCommands(files, client, i);
  }

  private async registerCommands(files: string[], client: Client, i: RubyCommands) {
    for (const file of files) {
      // Import the file
      let slashCommand = await import(file);
      if(slashCommand.default) slashCommand = slashCommand.default
      else if (slashCommand.command) slashCommand = slashCommand.command

      if (!(slashCommand instanceof SlashCommand)) throw new Error(`${file} is not a valid slash command\nTIP: Prefix files with a period (.) to ignore them`);

      // Add it to the map of commands
      this.commands.set(slashCommand.name, slashCommand)
    }

    // Get array of discord-ready configs (no callback)
    const configs = Array.from(this.commands.values()).map(({ name, description, options, type }) => ({ name, description, options, type }))

    const rest = new REST({ version: '10' }).setToken(client.token!);

    try {
      // Register to test servers (if true)
      if (i.globalTest && i.testServers) {
        for (const server of i.testServers) {
          this.registerSlashCommands(rest, configs, client, server)
        }
      }
      // Register to all servers (if false)
      else {
        this.registerSlashCommands(rest, configs, client)
      }
    }
    catch (e) {
      throw new Error(e as any);
    }

    client.on("interactionCreate", (i) => {
      if (!i.isApplicationCommand()) return

      // Get the command from the map
      const command = this.commands.get(i.commandName)
      if (!command) return

      // Run the preExec function
      if(this.preExec) this.preExec();
      // Run the callback
      // @ts-ignore
      command.callback({ interaction: i, client });
      // Run the postExec function
      if(this.postExec) this.postExec();
    })
  }

  private async registerSlashCommands(rest: REST, configs: Record<string, any>[], client: Client, serverID?: string) {
    if(serverID) await rest.put(Routes.applicationGuildCommands(client.user!.id, serverID), { body: configs })
    else await rest.put(Routes.applicationCommands(client.user!.id), { body: configs })
  }
}

export = SlashCommandHandler
