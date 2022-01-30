import { Player } from "../../Player"
import { Player as DPlayer } from "discord-player"

module.exports = {
  help: {
    name: 'add',
    description: "Ajoute la musique ou la playlist demandée à la queue.",
    type: "slash",
    category: "music",
    usage: "/add {lien|musique}",
    data: {
      name: "add",
      description: "Ajoute la musique ou la playlist demandée à la queue.",
      options: [
        {
          name: "lien",
          type: 3,
          description: "Le son ou la playlist que vous voulez ajouter. Peut-être un lien ou le nom du son ou de la playlist.",
          required: true
        }
      ]
    }
  },
  run: async(client, interaction) => {
    var player: DPlayer = Player.getPlayer()
    var queue = player.getQueue(interaction.guild)

    if(!queue || !queue.playing) return interaction.reply(':x: Aucun titre n\'est en cours de lecture. Veuillez essayer /play.')

    var query = interaction.options.getString('lien');

    await interaction.deferReply()
    const res = await player.search(query, {
      requestedBy: interaction.user 
    })

    if(!res || res.tracks.length <= 0) return await  interaction.followUp({content: ':x: Le titre ou la playlist demandée n\'a pas pu être trouvé.'})

    res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0])
    
    return await interaction.followUp({ content: `🎵 | ${res.playlist ? 'Playlist' : 'Titre'} ajouté à la queue avec succès.`})
  }
}