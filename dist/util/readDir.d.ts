interface IReadDirConfig {
    ignoreDot?: boolean;
}
export declare const readDir: (path: string, config?: IReadDirConfig | undefined) => string[];
export {};
