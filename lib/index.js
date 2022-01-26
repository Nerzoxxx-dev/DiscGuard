"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv").config();
var client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_PRESENCES] });
var prefix = process.env.PREFIX;
var commandsNoSlash = new discord_js_1.Collection();
client.on('message', (message) => {
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
