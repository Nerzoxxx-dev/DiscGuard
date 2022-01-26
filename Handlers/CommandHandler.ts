import { Collection } from "discord.js";
import { fstat, readdirSync, stat } from "fs";

export class CommandHandler  {
  public static handleCommands(commandsNoSlash: Collection<string, any>){
    var commandir = process.env.COMMANDS_DIR as string;
    var commands = CommandHandler.readDir(commandir, commandsNoSlash);
  }

  private static readDir(commandir: string, commandsNoSlash: Collection<string, any>){
    var commands = readdirSync("./" + commandir)
    commands.forEach(cmd => {
       stat(commandir + cmd, (err, stats) => {
          if(err) console.log(err);
          else {
            if(stats.isDirectory()){
              this.readDir(commandir + cmd + '/', commandsNoSlash);
            }else {
              var commandReq = require("../" + commandir + cmd)
              commandsNoSlash.set(commandReq.help.name, commandReq);
            }
          }
       })
    });
  }
}