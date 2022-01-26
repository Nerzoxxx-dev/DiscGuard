import { Client } from "discord.js";
import { readdirSync } from "fs";

export class EventsHandler{
  public static handleEvents(_client: Client){
    var eventDir = process.env.EVENTS_DIR as string;
    var events = readdirSync("./" + eventDir)
    for(var f of events){
      var eventReq = require("../" + eventDir + f)
      var eventName = f.split(".")[0]
      _client.on(eventName, eventReq.bind(null, _client))
    }
  }
}