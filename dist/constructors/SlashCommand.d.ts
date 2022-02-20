import { Client, CommandInteraction } from "discord.js";
interface Option {
}
export declare class SlashCommand {
    name: string;
    description: string;
    options: Option[];
    callback: ({ interaction, client }: {
        interaction: CommandInteraction;
        client: Client;
    }) => void;
    type: number;
    constructor(name: string, description: string, options: Option[], callback: ({ interaction, client }: {
        interaction: CommandInteraction;
        client: Client;
    }) => void);
}
export {};
