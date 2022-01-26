"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandHandler_1 = require("./CommandHandler");
const EventsHandler_1 = require("./EventsHandler");
const SlashCommandsHandler_1 = require("./SlashCommandsHandler");
class Handler {
    constructor(_commands, _client, _slashCommandsCollection) {
        this._commands = _commands;
        this._client = _client;
        this._slashCommandsCollection = _slashCommandsCollection;
    }
    handle() {
        CommandHandler_1.CommandHandler.handleCommands(this._commands);
        EventsHandler_1.EventsHandler.handleEvents(this._client);
        SlashCommandsHandler_1.SlashCommandsHandler.handleSlashCommands(this._slashCommandsCollection);
    }
}
exports.Handler = Handler;
