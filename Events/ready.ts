import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { SlashCommandsHandler } from "../Handlers/SlashCommandsHandler"

module.exports = async(client, ready) => {
  console.log("I'm ready!")

  var rest = new REST().setToken(process.env.TOKEN)
  var slashCommandsGlobals: Object[] = [];
  for(var f of SlashCommandsHandler.arrayOfSlashCommands){
    slashCommandsGlobals.push(f.help.data)
  }
  try {
   await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: slashCommandsGlobals },
    );
  }catch(e){
    console.log(e)
  }
}