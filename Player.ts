import {Player as DPlayer} from 'discord-player';
import { Client, MessageEmbed } from 'discord.js';
import {Embed} from './Utils/Embed';

export class Player {
  public static player: DPlayer;
  
  public static init(client: Client){
    Player.player = new DPlayer(client)
    Player.player.on('trackStart', (queue, track) => {
      var metadata = queue.metadata as any;
      metadata.send({embeds: [
        new MessageEmbed()
        .setTitle('🎵 Musique')
        .setDescription('Un nouveau titre vient d\'être joué.')
        .addField('> Titre de la musique', `${track.title}`)
        .setFooter(Embed.resolveFooter(client.user))
        .setTimestamp()
      ]})
    })
  }

  public static getPlayer(): DPlayer{
    return this.player;
  }
}