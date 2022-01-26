"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Handler_1 = require("./Handlers/Handler");
require("dotenv").config();
var client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_PRESENCES, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
var prefix = process.env.PREFIX;
var commandsNoSlash = new discord_js_1.Collection();
var SlashCommandsCollection = new discord_js_1.Collection();
new Handler_1.Handler(commandsNoSlash, client, SlashCommandsCollection).handle();
client.on('messageCreate', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    if (message.channel.type === "DM")
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();
    if (!commandsNoSlash.has(command))
        return;
    commandsNoSlash.get(command).run(client, message, args);
});
client.login(process.env.TOKEN);
