import { Guild } from 'discord.js';
import {GuildSettings} from '../API/GuildSettings';

module.exports = async (client, guild: Guild) => {
  var gSettings = new GuildSettings({guildId: guild.id})
  if(!gSettings.hasSettings()){
    var r = await guild.roles.create({
      name: 'DJ',
      color: 'GREY'
    })
    gSettings.setBase(r.id)
  }
}