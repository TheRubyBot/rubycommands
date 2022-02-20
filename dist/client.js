var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var client_exports = {};
__export(client_exports, {
  RubyCommands: () => RubyCommands,
  RubyError: () => RubyError
});
var import_path = require("path");
var import_SlashCommandHandler = __toESM(require("./handlers/SlashCommandHandler"));
class RubyCommands {
  constructor(client, config) {
    if (!client)
      throw new RubyError("A client was not provided");
    if (!config)
      throw new RubyError("A config was not provided");
    const {
      preExec,
      eventsDir,
      commandsDir,
      postExec,
      globalTest,
      owners,
      testServers
    } = config;
    this.eventsDir = eventsDir;
    this.commandsDir = commandsDir;
    this.globalTest = globalTest;
    this.owners = owners;
    this.testServers = testServers;
    if (require.main) {
      const { path } = require.main;
      if (path) {
        this.commandsDir = (0, import_path.join)(path, this.commandsDir);
        if (this.eventsDir)
          this.eventsDir = (0, import_path.join)(path, this.eventsDir);
      }
    }
    this.slash = new import_SlashCommandHandler.default(this, client, typeof preExec === "object" ? preExec == null ? void 0 : preExec.slash : preExec, typeof postExec === "object" ? postExec == null ? void 0 : postExec.slash : postExec);
  }
}
class RubyError extends Error {
  constructor(...message) {
    super(...message);
    this.name = "ERROR:Ruby";
  }
}
module.exports = __toCommonJS(client_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RubyCommands,
  RubyError
});
