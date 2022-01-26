import { Client, Collection } from "discord.js";
import { CommandHandler } from "./CommandHandler";
import { EventsHandler } from "./EventsHandler";
import { SlashCommandsHandler } from "./SlashCommandsHandler";

export class Handler{

  protected _commands: Collection<string, any>;

  protected _client: Client;

  protected _slashCommandsCollection: Collection<string, any>;

  constructor(_commands: Collection<string, any>, _client: Client, _slashCommandsCollection: Collection<string, any>){
    this._commands = _commands;
    this._client = _client;
    this._slashCommandsCollection = _slashCommandsCollection
  }

  public handle(){
    CommandHandler.handleCommands(this._commands);
    EventsHandler.handleEvents(this._client);
    SlashCommandsHandler.handleSlashCommands(this._slashCommandsCollection);
  }
}