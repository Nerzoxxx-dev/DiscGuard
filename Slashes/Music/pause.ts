import { Player } from "../../Player"
import { Player as DPlayer } from "discord-player"
import { Permissions } from "discord.js"
import { GuildSettings } from "../../API/GuildSettings"

module.exports = {
  help: {
    name: 'pause',
    description: "Met en pause la queue courrente de la musique.",
    type: "slash",
    category: "music",
    usage: "/pause",
    data: {
      name: "pause",
      description: "Met en pause la queue courrente de la musique.",
    }
  },
  run: async(client, interaction) => {
    var gSettings = new GuildSettings({guildId: interaction.guild.id});
    var player: DPlayer = Player.getPlayer()
    var queue = player.getQueue(interaction.guild)

    if(gSettings.djRoleEnabled()){
      if(!interaction.member.roles.cache.has(gSettings.getDjRoleId()) && !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply(':x: Vous n\'avez pas les permissions requises pour utiliser cette commande.')
    }

    if(!queue || !queue.playing) return interaction.reply(':x: Aucun titre n\'est en cours de lecture. Veuillez essayer /play.')

    const paused = queue.setPaused(true);

    return interaction.reply(paused ? ':white_check_mark: | La queue actuelle a bien été mise en pause.' : ':x: | Une erreur s\'est produite')
  }
}