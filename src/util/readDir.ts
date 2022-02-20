import { readdirSync } from "fs"
import { join } from "path"

interface IReadDirConfig {
  ignoreDot?: boolean;
}

export const readDir = (path: string, config?: IReadDirConfig) => {
  const files = readdirSync(path, { withFileTypes: true }).filter((x) => config?.ignoreDot && !x.name.startsWith("."))
  let matches: string[] = []

  for(const file of files) {
    if(file.isDirectory()) matches.push(...readDir(join(path, file.name), config));
    else {
      const fullPath = join(path, file.name);
      matches.push(fullPath)
    }
  }

  return matches
}
