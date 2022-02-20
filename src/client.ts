import type { Client } from "discord.js";
import { join } from "path"

type func = () => void;

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
}

export class RubyCommands {
  // Pre/Post exec
  public preExec: Config["preExec"] | undefined;
  public postExec: Config["postExec"] | undefined;

  // Directories
  public commandsDir: Config["commandsDir"];
  public eventsDir: Config["eventsDir"] | undefined;

  constructor(client: Client, config: Config) {
    if (!client) throw new RubyError("A client was not provided");
    if (!config) throw new RubyError("A config was not provided");

    const {
      preExec,
      eventsDir,
      commandsDir,
      postExec,
    } = config

    this.preExec = preExec;
    this.postExec = postExec;
    this.eventsDir = eventsDir;
    this.commandsDir = commandsDir;

    if(require.main) {
      const { path } = require.main

      if(path) {
        this.commandsDir = join(path, this.commandsDir)
        if (this.eventsDir) this.eventsDir = join(path, this.eventsDir)
      }
    }
  }
}

class RubyError extends Error {
  constructor(...message: any[]) {
    super(...message);

    this.name = "ERROR:Ruby"
  }
}
