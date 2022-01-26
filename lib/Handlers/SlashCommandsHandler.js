"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const util_1 = require("util");
const globPromise = util_1.promisify(glob_1.glob);
class SlashCommandsHandler {
    static async handleSlashCommands(slashCommandsCollection) {
        var slashCommandsDir = process.env.SLASH_COMMANDS_DIR;
        const slashCommands = await globPromise(`${process.cwd()}/${slashCommandsDir}/*/*.ts`);
        slashCommands.map((value) => {
            const file = require(value);
            if (!file ? .help.name : )
                return;
            slashCommandsCollection.set(file.name, file);
            SlashCommandsHandler.arrayOfSlashCommands.push(file);
        });
    }
}
SlashCommandsHandler.arrayOfSlashCommands = [];
exports.SlashCommandsHandler = SlashCommandsHandler;
