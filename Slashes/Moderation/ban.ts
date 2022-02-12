import { Permissions } from "discord.js"

module.exports = {
  help: {
    name: 'ban',
    description: "Bannit l'utilisateur passé en paramètre.",
    type: "slash",
    category: "moderation",
    usage: "/ban {user} {jours} [raison]",
    data: {
      name: "ban",
      description: "Bannit l'utilisateur passé en paramètre.",
      options: [
        {
          name: "utilisateur",
          type: 6,
          description: "La personne que vous voulez bannir",
          required: true
        },
        {
          name: 'jours',
          description: 'Combien de jours faut-il bannir l\'utilisateur ?',
          type: 10,
          required: true
        },
        {
          name: 'raison',
          description: 'Pourquoi bannir cet utilisateur ?',
          type: 3,
          required: false
        }
      ]
    }
  },
  run: async(client, interaction) => {
   if(!interaction.member.roles.cache.has(Permissions.FLAGS.BAN_MEMBERS) && !interaction.member.roles.cache.has(Permissions.FLAGS.ADMINISTRATOR) && interaction.guild.ownerId !== interaction.user.id) return interaction.reply(':x: | Vous n\'avez pas la permission requise pour bannir des membres.');

   var member = interaction.guild.members.cache.get(interaction.options.getUser('utilisateur').id)
   if(member.id === interaction.member.id) return interaction.reply(':x: | Vous ne pouvez pas vous bannir vous-même !')
   if(interaction.member.roles.highest.comparePositionTo(member.roles.highest) > 0) return interaction.reply(':x: | Vous ne pouvez pas bannir un utilisateur qui a un role plus haut que vous.');

   if(interaction.guild.members.cache.get(client.user.id).roles.highest.comparePositionTo(member.roles.highest) < 0) return interaction.reply(':x: | Je ne peux pas bannir un utilisateur qui a un role plus haut que moi.');

   if(member.banneable === false) return interaction.reply(':x: | Impossible de bannir ' + member.user.username);
   member.ban({reason: interaction.options.getString('raison'), days: interaction.options.getNumber('jours')})
   return interaction.reply(`:white_check_mark: | ${member.user.username} a été banni !`);
  }
}