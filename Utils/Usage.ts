import { MessageEmbed } from "discord.js";
import { GuildSettings } from "../API/GuildSettings";
import { Embed } from "./Embed";

export class Usage {
  public static generateUsageEmbed(name: string, usage: string, client, guildId){
    return new MessageEmbed()
    .setTitle(name)
    .setDescription('Voici comme utiliser la commande ' + name)
    .addField("> Usage ", usage.replace('{{prefix}}', new GuildSettings({guildId: guildId}).resolvePrefix()))
    .setFooter(Embed.resolveFooter(client))
  }
}