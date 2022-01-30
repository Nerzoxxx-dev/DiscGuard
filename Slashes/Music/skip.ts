import { Player } from "../../Player"
import { Player as DPlayer } from "discord-player"
import { GuildSettings } from "../../API/GuildSettings"
import { Permissions } from "discord.js"

module.exports = {
  help: {
    name: 'skip',
    description: "Passe à la prochaine musique dans la queue.",
    type: "slash",
    category: "music",
    usage: "/skip",
    data: {
      name: "skip",
      description: "Passe à la prochaine musique dans la queue."
    }
  },
  run: async(client, interaction) => {
    var player: DPlayer = Player.getPlayer()
    var queue = player.getQueue(interaction.guild)
    var gSettings = new GuildSettings({guildId: interaction.guild.id})

    if(gSettings.djRoleEnabled()){
      if(!interaction.member.roles.cache.some(r => r.id === gSettings.getDjRoleId()) && !interaction.guild.ownerId === interaction.user.id && !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply(':x: Vous n\'avez pas les permissions requises pour utiliser cette commande.')
    }

    if(!queue || !queue.playing) return interaction.reply(':x: Aucun titre n\'est en cours de lecture, veuillez utiliser la commande /play avant d\'utiliser la commande /skip.')

    await interaction.deferReply()
    var s = queue.skip()
    return await interaction.followUp({content: s ? '🎵 |  La musique actuelle ``'  + queue.current.title + ' a bien été skippée.``' : ':x: Une erreur s\'est produite, veuillez réessayer...'})
  }
}