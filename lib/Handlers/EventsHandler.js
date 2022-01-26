"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsHandler = void 0;
const fs_1 = require("fs");
const Handler_1 = require("./Handler");
class EventsHandler extends Handler_1.Handler {
    static handleEvents() {
        var eventDir = process.env.EVENTS_DIR;
        var events = (0, fs_1.readdirSync)(eventDir);
        for (var f of events) {
            var eventReq = require(eventDir + f);
            var eventName = f.split(".")[0];
            this._client.on(eventName, eventReq.bind([0], null));
        }
    }
}
exports.EventsHandler = EventsHandler;
