import { Client } from "discord.js"
import { GuildSettings } from "../API/GuildSettings"

module.exports = function(client: Client, member){
  var guildSettings = new GuildSettings(member.guild.id);
  if(guildSettings.isVerificationEnabled()){
    //ToDO: Verification
  }
} 