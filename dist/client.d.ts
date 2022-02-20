import type { Client } from "discord.js";
import SlashCommandHandler from "./handlers/SlashCommandHandler";
export declare type func = () => void;
interface Config {
    preExec?: func | {
        slash?: func;
        text?: func;
    };
    postExec?: func | {
        slash?: func;
        text?: func;
    };
    commandsDir: string;
    eventsDir?: string;
    globalTest?: boolean;
    testServers?: string[];
    owners?: string[];
}
export declare class RubyCommands {
    commandsDir: Config["commandsDir"];
    eventsDir: Config["eventsDir"] | undefined;
    slash: SlashCommandHandler;
    globalTest: boolean | undefined;
    owners: string[] | undefined;
    testServers: string[] | undefined;
    constructor(client: Client, config: Config);
}
export declare class RubyError extends Error {
    constructor(...message: any[]);
}
export {};
