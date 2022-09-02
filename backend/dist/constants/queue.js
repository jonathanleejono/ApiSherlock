"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepeatOptions = exports.setRepeatOptions = exports.getQueue = exports.setQueue = exports.jobBaseName = exports.queueBaseName = void 0;
exports.queueBaseName = "pingApiScheduleQueue";
exports.jobBaseName = "pingApisJob";
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