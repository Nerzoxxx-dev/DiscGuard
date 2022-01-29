import { Client, Collection, Intents } from "discord.js";
import { Database } from "./Database";
import {Handler} from "./Handlers/Handler";

require("dotenv").config()
var client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]})
var prefix = process.env.PREFIX as string
var commandsNoSlash: Collection<string, any> = new Collection();
var SlashCommandsCollection: Collection<string, any> = new Collection();

new Handler(commandsNoSlash, client, SlashCommandsCollection).handle();

client.on('messageCreate', (message) => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;
  if(message.channel.type === "DM") return;
  
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift() as string
  
  if(!commandsNoSlash.has(command)) return;
  
  commandsNoSlash.get(command).run(client, message, args)
})


Database.init()


client.login(process.env.TOKEN)

