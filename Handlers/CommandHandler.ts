import { Collection } from "discord.js";
import {glob} from "glob";
import {promisify} from "util";

const globPromise = promisify(glob)

export class CommandHandler  {
  public static arrayOfFile: any[] = [];
  public static handleCommands(commandsNoSlash: Collection<string, any>){
    this.readDir(commandsNoSlash)
  }

  private static async readDir(commandsNoSlash: Collection<string, any>){
    var commandsDir = process.env.COMMANDS_DIR;
    const slashCommands = await globPromise(`${process.cwd()}/${commandsDir}/*/*.ts`)
    this.arrayOfFile = slashCommands;

    slashCommands.map((value) => {
      const file = require(value);
      if(!file?.help.name) return;

      commandsNoSlash.set(file.help.name, file)
      console.log(file.help.name + "  COMMAND")
    });
  }
}