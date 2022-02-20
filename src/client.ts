import type { Client } from "discord.js";
import { join } from "path"
import SlashCommandHandler from "./handlers/SlashCommandHandler";

export type func = () => void;

interface Config {
  // Pre & Post command functions
  preExec?: func | {
    slash?: func;
    text?: func;
  };
  postExec?: func | {
    slash?: func;
    text?: func;
  };

	// Directories
	commandsDir: string
	eventsDir?: string

  // Booleans
  globalTest?: boolean // If true, commands  will only applied to testServers

  // Other
  testServers?: string[]
  owners?: string[]
}

export class RubyCommands {
  // Directories
  public commandsDir: Config["commandsDir"];
  public eventsDir: Config["eventsDir"] | undefined;

  // Handlers
  public slash: SlashCommandHandler;
  // public command: TextCommandHandler;
  // public event: EventHandler;

  public globalTest: boolean | undefined;
  public owners: string[] | undefined;
  public testServers: string[] | undefined;

  constructor(client: Client, config: Config) {
    if (!client) throw new RubyError("A client was not provided");
    if (!config) throw new RubyError("A config was not provided");

    const {
      preExec,
      eventsDir,
      commandsDir,
      postExec,
      globalTest,
      owners,
      testServers
    } = config

    this.eventsDir = eventsDir;
    this.commandsDir = commandsDir;
    this.globalTest = globalTest;
    this.owners = owners;
    this.testServers = testServers;

    if(require.main) {
      const { path } = require.main

      if(path) {
        this.commandsDir = join(path, this.commandsDir)
        if (this.eventsDir) this.eventsDir = join(path, this.eventsDir)
      }
    }

    // Assign the handlers
    this.slash = new SlashCommandHandler(this, client, typeof preExec === "object" ? preExec?.slash : preExec, typeof postExec === "object" ? postExec?.slash : postExec);
    // this.command = new TextCommandHandler(client, this);
    // if(this.eventsDir) this.event = new EventHandler(client, this);
  }
}

export class RubyError extends Error {
  constructor(...message: any[]) {
    super(...message);

    this.name = "ERROR:Ruby"
  }
}
