import type { Client } from "discord.js";
import type { RubyCommands, func } from "..";
import { SlashCommand } from "../constructors/SlashCommand";
declare class SlashCommandHandler {
    commands: Map<string, SlashCommand>;
    preExec: func | undefined;
    postExec: func | undefined;
    constructor(i: RubyCommands, client: Client, slashPreExec: func | undefined, slashPostExec: func | undefined);
    private registerCommands;
    private registerSlashCommands;
}
export = SlashCommandHandler;
