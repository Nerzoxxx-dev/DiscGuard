import { Player } from "../../Player"
import { Player as DPlayer } from "discord-player"

module.exports = {
  help: {
    name: 'play',
    description: "Joue la musique demandée",
    type: "slash",
    category: "music",
    usage: "/play {lien|musique}",
    data: {
      name: "play",
      description: "Joue le son passé dans le paramètre du lien.",
      options: [
        {
          name: "lien",
          type: 3,
          description: "Le son que vous voulez jouer. Peut-être un lien ou le nom du son.",
          required: true
        }
      ]
    }
  },
  run: async(client, interaction) => {
    if(!interaction.member.voice.channelId) return interaction.reply(':x: Vous n\'êtes pas dans un salon vocal.')
    if(interaction.guild.me.voice.channelId && interaction.guild.me.voice.channelId !== interaction.member.voice.channelId) return interaction.reply(':x: Vous n\'êtes pas dans le même salon vocal que moi.')
    var query = interaction.options.getString('lien')
    var player: DPlayer = Player.getPlayer()
    const queue = player.createQueue(interaction.guild, {
      metadata: interaction.channel
    });

    try {
      if(!queue.connection) await queue.connect(interaction.member.voice.channel);
    }catch(e) {
      interaction.reply(':x: Je ne peux pas rejoindre le salon vocal auquel vous êtes connecté(e).', {ephemeral: true})
    }
    
    await interaction.deferReply()
    const res = await player.search(query, {
      requestedBy: interaction.user
    })

    if(!res || res.tracks.length <= 0) return interaction.followUp({content: ':x: Le titre ou la playlist n\'a pas pu être trouvé.'})

    res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0])

    await interaction.followUp({content: `🎵  Chargement | ${res.playlist ? 'Playlist': 'Titre'} ajouté à la queue.!`})

    if(!queue.playing) queue.play()
  }
}