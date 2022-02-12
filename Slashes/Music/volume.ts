import { Player } from "../../Player"
import { Player as DPlayer } from "discord-player"
import { Permissions } from "discord.js"
import { GuildSettings } from "../../API/GuildSettings"

module.exports = {
  help: {
    name: 'volume',
    description: "Met le volume de la musique sur le nombre demandé dans les paramètres.",
    type: "slash",
    category: "music",
    usage: "/volume <nombre:0-100>",
    data: {
      name: "volume",
      description: "Modifie le volume de la musique",
      options: [{
        name: "volume",
        description: "Le pourcentage de volume.",
        type: 10,
        required: true
      }]
    }
  },
  run: async(client, interaction) => {
    var gSettings = new GuildSettings({guildId: interaction.guild.id});
    var player: DPlayer = Player.getPlayer()
    var queue = player.getQueue(interaction.guild)
    var volume = interaction.options.getNumber('volume')

    if(gSettings.djRoleEnabled()){
      if(!interaction.member.roles.cache.has(gSettings.getDjRoleId()) && !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply(':x: Vous n\'avez pas les permissions requises pour utiliser cette commande.')
    }

    if(!queue || !queue.playing) return interaction.reply(':x: Aucun titre n\'est en cours de lecture. Veuillez essayer /play.')

    if(volume > 100 || volume < 0) return interaction.reply(':x: | Le volume promis est incorrecte.')

    await interaction.deferReply();

    var v = queue.setVolume(volume);

    return interaction.followUp({content: v ? `:white_check_mark: | Le volume de la musique a été changé sur ${volume}%` : ':x: | Une erreur s\'est produite.'})
  }
}