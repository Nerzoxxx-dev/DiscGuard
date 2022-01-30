const axios =  require('axios');
import { MessageEmbed } from "discord.js";
import moment from "moment";
import { Embed } from "../../Utils/Embed";

module.exports = {
  help: {
    name: 'userinfo',
    description: 'Affiche diverses informations relatives à l\'auteur ou à la personne mentionnée.',
    category: 'infos',
    type: 'slash',
    usage: '/userinfo [mention]',
    data: {
      name: 'userinfo',
      description: 'Affiche les informations de l\'auteur ou de la mention.',
      options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur pour lequel vous voulez plus d\'informations.',
          type: 6,
          required: false
        }
      ]
    }
  },
  run: async(client, interaction) => {
    var usr;
    var opt = interaction.options.getUser('utilisateur')
    if(!opt) usr  = interaction.user; else usr = opt;
    var member = interaction.guild.members.cache.find(m => m.id === usr.id)
    var datas: any = {}
    var status = ""
    switch(member.presence.status){
      case 'online':
        status = "🟢 En ligne"
        break;
      case 'dnd':
        status = "🔴 Ne pas déranger"
        break;
      case 'idle':
        status = "🟠 AFK"
        break;
      case 'offline':
        status = "⚪ Hors-Ligne"
        break;
    }
    datas.status = status;
    const roles = member.roles.cache.sort((a, b) => b.position - a.position).filter(role => role.id !== interaction.guild.roles.everyone.id).map(role => role.toString());
    var rolesStr = roles.splice(0, 29).join(", ");

    if(rolesStr.length > 300) rolesStr = rolesStr.substr(0, 310) + " et plus...";
    datas.rolesStr = rolesStr;

    var activity = member.presence.activities[0];
    var activityToDisplay = "";
    if(activity){
      if(activity.name !== "Custom Status") {
        switch (activity.type) {
            case "PLAYING": activityToDisplay = 'Joue à '; break;
            case "LISTENING": activityToDisplay = 'Écoute '; break;
            case "WATCHING": activityToDisplay = 'Regarde '; break;
            case "COMPETING": activityToDisplay = 'Participant à: '; break;
            case "STREAMING": activityToDisplay = 'Streame '; break;
        };

        activityToDisplay+= activity.name;
    }else {
      activityToDisplay = `${activity.emoji ? activity.emoji : ""} ${activity.state ? activity.state : ""}`;
    }
  }

  datas.activityToDisplay = activityToDisplay;

    var embed = new MessageEmbed()
    .setTitle(`**Quelques informations sur ${member.user.username}#${member.user.discriminator}**`)
    .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
    .addField(' > **Nom d\'utilisateur**', `\`\`${member.user.username}\`\``, true)
    .addField('> **Discriminateur**', `\`\`#${member.user.discriminator}\`\``, true)
    .addField('> **Identifiant**', `\`\`${member.id}\`\``, true)
    .addField('> **Compte crée le**', `\`\`${moment(usr.createdAt).format('DD/MM/YYYY')}\`\``, true)
    .addField('> **À rejoint le**', `\`\`${moment(member.joinedAt).format('DD/MM/YYYY')}\`\``, true)
    .addField('> **Status**', `\`\`${datas.status}\`\``, true)
    .addField('> **Activité**', `\`\`${datas.activityToDisplay.length > 0  ? datas.activityToDisplay : "Rien à afficher"}\`\``, true)
    .addField('> **Robot ?**', `\`\`${member.user.bot ? 'Oui' : 'Non'}\`\``, true)
    .addField('> **Roles**', `${datas.rolesStr.lenth > 0 ? datas.rolesStr : '``Rien à afficher``'}`)
    .setColor('RANDOM')
    .setImage(await getUserBannerUrl(client, member.user.id))
    .setTimestamp()
    .setFooter(Embed.resolveFooter(usr))
    interaction.reply(':white_check_mark: Envoyé !')
    interaction.channel.send({embeds: [embed]})
  }

  
}
async function getUserBannerUrl(client, userId, { dynamicFormat = true, defaultFormat = "webp", size = 512 } = {}) {
  
  if (![16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(size)) {
      throw new Error(`The size '${size}' is not supported!`);
  }

  if (!["webp", "png", "jpg", "jpeg"].includes(defaultFormat)) {
      throw new Error(`The format '${defaultFormat}' is not supported as a default format!`)
  }

  const user = await client.api.users(userId).get();
  if (!user.banner) return null;

  const query = `?size=${size}`;
  const baseUrl = `https://cdn.discordapp.com/banners/${userId}/${user.banner}`;
 
  if (dynamicFormat) {
      const { headers } = await axios.head(baseUrl);
      if (headers && headers.hasOwnProperty("content-type")) {
          return baseUrl + (headers["content-type"] == "image/gif" ? ".gif" : `.${defaultFormat}`) + query;
      }
  }

  return baseUrl + `.${defaultFormat}` + query;

}
