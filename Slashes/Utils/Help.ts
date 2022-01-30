import { Utils } from "../../Utils/Utils"
import { SlashCommandsHandler } from "../../Handlers/SlashCommandsHandler";
import {  MessageEmbed } from "discord.js";
import { GuildSettings } from "../../API/GuildSettings";
import { CommandHandler } from "../../Handlers/CommandHandler";
import { Embed } from "../../Utils/Embed";

function resolveCategory(baseStr){
  switch(baseStr){
    case 'utils':
      return '> 🧰  Outils';
      break;
    case 'music':
      return '> 🎵 Musique';
      break;
  }
}

module.exports.run = async function(client, interaction){
  var channel = await client.channels.fetch(interaction.channelId)
  var commandOpt = interaction.options.getString('command') as string
  var utils = [];
  var music = [];
  var filesH = [];
  for(var f of SlashCommandsHandler.arrayOfFile){filesH.push(f)}
  for(var f of CommandHandler.arrayOfFile){filesH.push(f)}
  for(var f of filesH){
    var file = require(f)
    switch(file.help.category){
      case 'utils':
        switch(file.help.type){
          case 'slash':
            utils.push('``' + file.help.name + ': Commande slash``')
            break;
          case 'bot':
            utils.push('``' + file.help.name + ': Commande du robot``')
            break;
          default:
            utils.push('``' + file.help.name + ': Commande slash``')
            break;
        }
      break;
      case 'music':
        switch(file.help.type){
          case 'slash':
            music.push('``' + file.help.name + ': Commande slash``')
            break;
          case 'bot':
            music.push('``' + file.help.name + ': Commande du robot``')
            break;
          default:
            music.push('``' + file.help.name + ': Commande slash``')
            break;
        }
        break;
    }
  }
  var date = new Date().toLocaleDateString('fr-FR');
  if(!commandOpt){
    var embed: MessageEmbed = new MessageEmbed()
    .setTitle('Panneau des commandes')
    .setDescription('Affiche toutes les commandes du bot')
    .addField(resolveCategory('utils'), utils.length > 0 ? utils.join(' ') : '``Rien à afficher``')
    .addField(resolveCategory('music'), music.length > 0 ? music.join(' ') : '``Rien à afficher``')
    .setFooter(Embed.resolveFooter(client))

    interaction.reply(":white_check_mark: Envoyé!")
    return channel.send({embeds: [embed]})
  }else {
    var cmdName = commandOpt.replace('_help.', '')
    var files = [];
    for(var fN of SlashCommandsHandler.arrayOfFile){
      files.push(require(fN))
    }
    for(var fN of CommandHandler.arrayOfFile){
      files.push(require(fN))
    }
    var file = undefined;
    for(var f of files){
      if(f.help.name === cmdName) file = f;
    }
    if(!file) return interaction.reply(':x: La commande n\'a pas pu être trouvée.')

    var embed = new MessageEmbed()
    .setTitle("Commande trouvée: " + file.help.name)
    .setDescription(file.help.description)
    .addField('Catégorie', resolveCategory(file.help.category))
    .addField('Comment l\'utiliser ?', `\`\`${file.help.usage.replace('{{prefix}}', new GuildSettings({guildId: interaction.guild.id}).resolvePrefix())}\`\``)
    .setFooter(Embed.resolveFooter(client));
    interaction.reply(':white_check_mark: Envoyé !')
    return channel.send({embeds: [embed]})
  }
}


module.exports.help = {
  name: "help",
  description: "Affiche toutes les commandes de " + Utils.getBotName(),
  category: "utils",
  usage: "/help [command]",
  type: "slash"
}

function resolveCommandChoices(): Object[] {
  var choices = []
  for(var fN of SlashCommandsHandler.arrayOfFile){
    var f = require(fN)
    choices.push({name: f.help.name, value: "_help." + f.help.name})
  }
  for (var fN of CommandHandler.arrayOfFile){
    var f = require(fN);
    choices.push({name: f.help.name, value: '_help.' + f.help.name})
  }
  return choices;
}

module.exports.help.data = {
  name: "help",
  description: "Panneau d'aide: affiche les commandes de " + Utils.getBotName(),
  options: [{
    name: "command",
    description: "Affiche des informations sur la commande demandée.",
    type: 3,
    required: false,
    choices: resolveCommandChoices()
  }],
}
