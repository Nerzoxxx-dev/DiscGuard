import { Client, Collection } from "discord.js";
import {glob} from "glob";
import {promisify} from "util";

const globPromise = promisify(glob)

export class SlashCommandsHandler {

  public static arrayOfSlashCommands = [];

  public static async handleSlashCommands(slashCommandsCollection: Collection<string, any>){
    var slashCommandsDir = process.env.SLASH_COMMANDS_DIR;
    const slashCommands = await globPromise(`${process.cwd()}/${slashCommandsDir}/*/*.ts`)

    slashCommands.map((value) => {
      const file = require(value);
      if(!file?.help.name) return;

      slashCommandsCollection.set(file.name, file)
      SlashCommandsHandler.arrayOfSlashCommands.push(file)
    });
  }
}