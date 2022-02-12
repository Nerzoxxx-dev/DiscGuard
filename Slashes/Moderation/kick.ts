import { Permissions } from "discord.js"

module.exports = {
  help: {
    name: 'kick',
    description: "Exclu l'utilisateur passé en paramètre.",
    type: "slash",
    category: "moderation",
    usage: "/kick {user} [raison]",
    data: {
      name: "kick",
      description: "Exclu l'utilisateur passé en paramètre.",
      options: [
        {
          name: "utilisateur",
          type: 6,
          description: "La personne que vous voulez exclure",
          required: true
        },
        {
          name: 'raison',
          description: 'Pourquoi exclure cet utilisateur ?',
          type: 3,
          required: false
        }
      ]
    }
  },
  run: async(client, interaction) => {
   if(!interaction.member.roles.cache.has(Permissions.FLAGS.BAN_MEMBERS) && !interaction.member.roles.cache.has(Permissions.FLAGS.ADMINISTRATOR) && interaction.guild.ownerId !== interaction.user.id) return interaction.reply(':x: | Vous n\'avez pas la permission requise pour exclure des membres.');

   var member = interaction.guild.members.cache.get(interaction.options.getUser('utilisateur').id)
   if(member.id === interaction.member.id) return interaction.reply(':x: | Vous ne pouvez pas vous exclure vous-même !')
   if(interaction.member.roles.highest.comparePositionTo(member.roles.highest) > 0) return interaction.reply(':x: | Vous ne pouvez pas exclure un utilisateur qui a un role plus haut que vous.');
   
   if(interaction.guild.members.cache.get(client.user.id).roles.highest.comparePositionTo(member.roles.highest) < 0) return interaction.reply(':x: | Je ne peux pas exclure un utilisateur qui a un role plus haut que moi.');

   if(member.kickeable === false) return interaction.reply(':x: | Impossible d\'exclure ' + member.user.username);
   member.kick(interaction.options.getString('raison'))
   return interaction.reply(`:white_check_mark: | ${member.user.username} a été exclu !`);
  }
}