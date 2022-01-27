"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const SlashCommandsHandler_1 = require("../Handlers/SlashCommandsHandler");
module.exports = async (client, ready) => {
    console.log("I'm ready!");
    var rest = new rest_1.REST().setToken(process.env.TOKEN);
    var slashCommandsGlobals = [];
    for (var f of SlashCommandsHandler_1.SlashCommandsHandler.arrayOfSlashCommands) {
        slashCommandsGlobals.push(f.help.data);
    }
    try {
        await rest.put(v9_1.Routes.applicationCommands(client.user.id), { body: slashCommandsGlobals });
    }
    catch (e) {
        console.log(e);
    }
};
