import type { Client } from "discord.js";
declare type func = () => void;
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
}
export declare class RubyCommands {
    preExec: Config["preExec"] | undefined;
    postExec: Config["postExec"] | undefined;
    commandsDir: Config["commandsDir"];
    eventsDir: Config["eventsDir"] | undefined;
    constructor(client: Client, config: Config);
}
export {};
