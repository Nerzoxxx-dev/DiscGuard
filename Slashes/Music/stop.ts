import { Player } from "../../Player"
import { Player as DPlayer } from "discord-player"
import { GuildSettings } from "../../API/GuildSettings"
import { Permissions } from "discord.js"

module.exports = {
  help: {
    name: 'stop',
    description: "Arrête la musique et la queue en cours.",
    type: "slash",
    category: "music",
    usage: "/stop",
    data: {
      name: "stop",
      description: "Arrête la musique et la queue en cours."
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
    queue.destroy(true)

    return await interaction.followUp({content: '🎵 | La queue a bien été stoppée.'})
  }
}