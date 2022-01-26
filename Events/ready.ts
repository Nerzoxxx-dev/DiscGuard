import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { SlashCommandsHandler } from "../Handlers/SlashCommandsHandler"

module.exports = async(client, ready) => {
  console.log("I'm ready!")

  var rest = new REST().setToken(process.env.TOKEN)
  var slashCommandsGlobals: Object[] = [];
  var slashCommandsGuilds: any[] = [];
  for(var f of SlashCommandsHandler.arrayOfSlashCommands){
    if(f.help.type === undefined) slashCommandsGlobals.push(f.help.data.toJSON())
    else {
      switch(f.help.type){
        case 'global':
          slashCommandsGlobals.push(f.data.toJSON())
          break;
        case 'guild':
          slashCommandsGuilds.push({data: f.data.toJSON(), id: f.help.guildid})
          break;
        default:
          slashCommandsGlobals.push(f.data.toJSON())
          break;
      }
    }
  }
  try {
     await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: slashCommandsGuilds },
      );
  }catch(e){
    console.log(e)
  }
  slashCommandsGuilds.forEach(async c => {
    try {
      await rest.put(
      Routes.applicationGuildCommands(c.id, client.user.id),
      { body: c.data },
      );
      }catch(e){
        console.log(e)
      }
  })
}