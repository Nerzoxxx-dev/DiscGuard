"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const fs_1 = require("fs");
const Handler_1 = require("./Handler");
class CommandHandler extends Handler_1.Handler {
    static handleCommands() {
        var commandir = process.env.COMMANDS_DIR;
        var commands = CommandHandler.readDir(commandir);
    }
    static readDir(commandir) {
        var commands = (0, fs_1.readdirSync)(commandir);
        commands.forEach(cmd => {
            (0, fs_1.stat)(commandir + cmd, (err, stats) => {
                if (err)
                    console.log(err);
                else {
                    if (stats.isDirectory()) {
                        this.readDir(commandir + cmd);
                    }
                    else {
                        var commandReq = require(commandir + cmd);
                        CommandHandler._commands.set(commandReq.help.name, commandReq);
                    }
                }
            });
        });
    }
}
exports.CommandHandler = CommandHandler;
