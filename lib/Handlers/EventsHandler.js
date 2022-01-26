"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class EventsHandler {
    static handleEvents(_client) {
        var eventDir = process.env.EVENTS_DIR;
        var events = fs_1.readdirSync("./" + eventDir);
        for (var f of events) {
            var eventReq = require("../" + eventDir + f);
            var eventName = f.split(".")[0];
            _client.on(eventName, eventReq.bind(null, _client));
        }
    }
}
exports.EventsHandler = EventsHandler;
