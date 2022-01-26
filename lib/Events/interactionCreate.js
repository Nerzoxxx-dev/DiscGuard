"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommandsHandler_1 = require("../Handlers/SlashCommandsHandler");
module.exports = (client, interaction) => {
    if (!interaction.isCommand())
        return;
    SlashCommandsHandler_1.SlashCommandsHandler.arrayOfSlashCommands.forEach(f => {
        if (f.help.name === interaction.commandName) {
            f.run(client, interaction);
        }
    });
};
