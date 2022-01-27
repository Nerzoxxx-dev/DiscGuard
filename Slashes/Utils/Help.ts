import { promisify } from "util"
import { Utils } from "../../Utils/Utils"
import {glob} from "glob";
import { readdirSync } from "fs";
import { SlashCommandsHandler } from "../../Handlers/SlashCommandsHandler";
import { Client, MessageEmbed, TextChannel } from "discord.js";
const globPromise = promisify(glob)

function resolveCategory(baseStr){
  switch(baseStr){
    case 'utils':
      return '> 🧰  Outils';
  }
}

module.exports.run = async function(client, interaction){
  var channel = await client.channels.fetch(interaction.channelId)
  var commandOpt = interaction.options.getString('command') as string
  var utils = []
  for(var f of SlashCommandsHandler.arrayOfFile){
    var file = require(f)
    switch(file.help.category){
      case 'utils':
        utils.push('``' + file.help.name + '``')
        break;
    }
  }
  var date = new Date().toLocaleDateString('fr-FR');
  if(!commandOpt){
    var embed: MessageEmbed = new MessageEmbed()
    .setTitle('Panneau des commandes')
    .setDescription('Affiche toutes les commandes du bot')
    .addField(resolveCategory('utils'), utils.join(' '))
    .setFooter({ text: 'DiscGuard | ' + date, iconURL: client.user.displayAvatarURL() })

    interaction.reply(":white_check_mark: Envoyé!")
    return channel.send({embeds: [embed]})
  }else {
    var cmdName = commandOpt.replace('_help.', '')
    var files = [];
    for(var fN of SlashCommandsHandler.arrayOfFile){
      var f = require(fN)
      files.push(f)
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
    .addField('Comment l\'utiliser ?', `\`\`/${file.help.name}\`\``)
    .setFooter({ text: 'DiscGuard | ' + date, iconURL: client.user.displayAvatarURL() });
    interaction.reply(':white_check_mark: Envoyé !')
    return channel.send({embeds: [embed]})
  }
}


module.exports.help = {
  name: "help",
  description: "Affiche toutes les commandes de " + Utils.getBotName(),
  category: "utils"
}

function resolveCommandChoices(): Object[] {
  var choices = []
  for(var fN of SlashCommandsHandler.arrayOfFile){
    var f = require(fN)
    choices.push({name: f.help.name, value: "_help." + f.help.name})
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
