"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const SlashCommandsHandler_1 = require("../Handlers/SlashCommandsHandler");
module.exports = async (client, ready) => {
    console.log("I'm ready!");
    var rest = new rest_1.REST().setToken(process.env.TOKEN);
    var slashCommandsGlobals = [];
    var slashCommandsGuilds = [];
    for (var f of SlashCommandsHandler_1.SlashCommandsHandler.arrayOfSlashCommands) {
        if (f.help.type === undefined)
            slashCommandsGlobals.push(f.help.data.toJSON());
        else {
            switch (f.help.type) {
                case 'global':
                    slashCommandsGlobals.push(f.data.toJSON());
                    break;
                case 'guild':
                    slashCommandsGuilds.push({ data: f.data.toJSON(), id: f.help.guildid });
                    break;
                default:
                    slashCommandsGlobals.push(f.data.toJSON());
                    break;
            }
        }
    }
    try {
        await rest.put(v9_1.Routes.applicationCommands(client.user.id), { body: slashCommandsGuilds });
    }
    catch (e) {
        console.log(e);
    }
    slashCommandsGuilds.forEach(async (c) => {
        try {
            await rest.put(v9_1.Routes.applicationGuildCommands(c.id, client.user.id), { body: c.data });
        }
        catch (e) {
            console.log(e);
        }
    });
};
