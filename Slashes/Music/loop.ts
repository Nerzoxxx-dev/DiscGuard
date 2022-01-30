import { Player } from "../../Player"
import { Player as DPlayer, QueueRepeatMode } from "discord-player"
import { GuildSettings } from "../../API/GuildSettings"
import { Permissions } from "discord.js"

module.exports = {
  help: {
    name: 'loop',
    description: "Joue en boucle la musique en cours.",
    type: "slash",
    category: "music",
    usage: "/loop {mode}",
    data: {
      name: "loop",
      description: "Joue en boucle la musique en cours.",
      options: [
        {
          name: 'boucle',
          description: 'Le mode de boucle demandé',
          type: 10,
          required: true,
          choices: [
            {
              name: 'Titre',
              value: QueueRepeatMode.TRACK
            },
            {
              name: 'Queue',
              value: QueueRepeatMode.QUEUE
            },
            {
              name: "Titres automatiques",
              value: QueueRepeatMode.AUTOPLAY
            },
            {
              name: "Off",
              value: QueueRepeatMode.OFF
            }
          ]
        }
      ]
    }
  },
  run: async(client, interaction) => {
    var player: DPlayer = Player.getPlayer()
    var queue = player.getQueue(interaction.guild)
    var gSettings = new GuildSettings({guildId: interaction.guild.id})

    if(gSettings.djRoleEnabled()){
      if(!interaction.member.roles.cache.has(gSettings.getDjRoleId()) && !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply(':x: Vous n\'avez pas les permissions requises pour utiliser cette commande.')
    }

    if(!queue || !queue.playing) return interaction.reply(':x: Aucun titre n\'est en cours de lecture, veuillez utiliser la commande /play avant d\'utiliser la commande /skip.')

    await interaction.deferReply()
    var loopMode = interaction.options.getNumber('boucle')
    if(queue.repeatMode === loopMode) return await interaction.followUp({content: ':x: La boucle est déjà mise sur l\'option demandée.'})

    var s = queue.setRepeatMode(loopMode)
    var mode = loopMode === QueueRepeatMode.TRACK ? "🔂" : loopMode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
    return await interaction.followUp({content: s ? `🎵 | Le mode de boucle a bien été mise à jour: ${mode}` : ':x: Une erreur s\'est produite.'})
  }
}