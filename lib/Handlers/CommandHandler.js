"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class CommandHandler {
    static handleCommands(commandsNoSlash) {
        var commandir = process.env.COMMANDS_DIR;
        var commands = CommandHandler.readDir(commandir, commandsNoSlash);
    }
    static readDir(commandir, commandsNoSlash) {
        var commands = fs_1.readdirSync("./" + commandir);
        commands.forEach(cmd => {
            fs_1.stat(commandir + cmd, (err, stats) => {
                if (err)
                    console.log(err);
                else {
                    if (stats.isDirectory()) {
                        this.readDir(commandir + cmd + '/', commandsNoSlash);
                    }
                    else {
                        var commandReq = require("../" + commandir + cmd);
                        commandsNoSlash.set(commandReq.help.name, commandReq);
                    }
                }
            });
        });
    }
}
exports.CommandHandler = CommandHandler;
