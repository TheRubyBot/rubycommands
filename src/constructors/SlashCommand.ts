import { Client, CommandInteraction } from "discord.js";
import { RubyError } from "..";

interface Option {}

export class SlashCommand {
  public type: number = 1;

  constructor(public name: string, public description: string, public options: Option[], public callback: ({ interaction, client }: { interaction: CommandInteraction, client: Client }) => void) {
    const nameRegex: RegExp = /^[a-zA-Z0-9_]+$/;
    if (!nameRegex.test(name)) throw new RubyError(`Invalid name: ${name}`);
  }
}