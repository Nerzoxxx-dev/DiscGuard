"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const CommandHandler_1 = require("./CommandHandler");
const EventsHandler_1 = require("./EventsHandler");
class Handler {
    constructor(_commands, _client) {
        Handler._commands = _commands;
        Handler._client = _client;
    }
    handle() {
        CommandHandler_1.CommandHandler.handleCommands();
        EventsHandler_1.EventsHandler.handleEvents();
    }
}
exports.Handler = Handler;
