import chokidar from "chokidar";
import chalk from "chalk";
import { build as b } from "esbuild";
import { dtsPlugin } from "esbuild-plugin-d.ts";
import { readFileSync, writeFileSync } from "fs";

const srcPath = "src";
const distPath = "dist";
const errorTag = `${chalk.bgRed.bold(" ERROR ")} `;

// This is only to stop it from rebuilding everything on start and stop console spam
let ready = false;

chokidar
  .watch(srcPath)
  .on("ready", () => {
    ready = true;
    console.log(chalk.bgGreen.black.bold(" Ready! "));
  })
  .on("all", async (e, p) => {
    if (!ready) return;
    e = e.toUpperCase();

    switch (e) {
      case "CHANGE":
      case "ADD":
        const out = p.replace(/^src/, distPath).replace(/[t|j]s$/, "js");
        await build(e, p, out);
        break;
    }
  });

const build = async (e, inPath, outPath) => {
  const args = process.argv;
  const plugins = [];

  if (!args.includes("--no-dts")) plugins.push(dtsPlugin());

  const start = Date.now();

  b({
    entryPoints: [inPath],
    plugins,
    outfile: outPath,
    format: "cjs",
    platform: "node",
    allowOverwrite: true,
  });

  incrementRevision(!args.includes("--prod"));

  console.log(
    `${chalk.bgGreen.black.bold(
      ` ${e} (${Date.now() - start}ms) `
    )} ${inPath} => ${outPath}`
  );
};

const incrementRevision = (dev) => {
  const pjson = JSON.parse(readFileSync("package.json"));
  console.log(pjson);

  const [
    major, // *Backwards -in-compatable* changes
    minor, // Added functionality in a *backwards compatable* way
    patch, // *Backwards compatable* bug changes
    ...therest
  ] = pjson.version.split(/[.-]+/g);

  pjson.revision++;

  console.log(major, minor, patch, pjson.revision);
  // DEV: <major>.<minor>.<patch>-dev<revision>
  // PRODUCTION: <major>.<minor>.<patch>

  const baseVersion = `${major}.${minor}.${patch}`;

  if (dev) {
    const versionString = `${baseVersion}-dev${pjson.revision}`;
    pjson.version = versionString;
  } else pjson.version = baseVersion;

  console.log(pjson);
};
