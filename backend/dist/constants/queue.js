"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepeatOptions = exports.setRepeatOptions = exports.getQueue = exports.setQueue = void 0;
let myQueue;
let repeatOptions;
async function setQueue(queue) {
    myQueue = queue;
}
exports.setQueue = setQueue;
async function getQueue() {
    return myQueue;
}
exports.getQueue = getQueue;
function setRepeatOptions(options) {
    repeatOptions = options;
}
exports.setRepeatOptions = setRepeatOptions;
async function getRepeatOptions() {
    return repeatOptions;
}
exports.getRepeatOptions = getRepeatOptions;
//# sourceMappingURL=queue.js.map