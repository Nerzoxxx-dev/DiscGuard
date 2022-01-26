import { SlashCommandsHandler } from "../Handlers/SlashCommandsHandler";

module.exports = (client, interaction) => {
  if(!interaction.isCommand()) return;
  SlashCommandsHandler.arrayOfSlashCommands.forEach(f => {
    if(f.help.name === interaction.commandName){
      f.run(client, interaction)
    }
  });
}