"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueScheduler = exports.setQueueScheduler = exports.getQueueWorker = exports.setQueueWorker = exports.getRepeatOptions = exports.setRepeatOptions = exports.getQueue = exports.setQueue = exports.jobBaseName = exports.queueBaseName = void 0;
exports.queueBaseName = "pingApiScheduleQueue";
exports.jobBaseName = "pingApisJob";
let myQueue;
let repeatOptions;
let queueWorker;
let queueScheduler;
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
async function setQueueWorker(newQueueWorker) {
    queueWorker = newQueueWorker;
}
exports.setQueueWorker = setQueueWorker;
async function getQueueWorker() {
    return queueWorker;
}
exports.getQueueWorker = getQueueWorker;
function setQueueScheduler(newQueueScheduler) {
    queueScheduler = newQueueScheduler;
}
exports.setQueueScheduler = setQueueScheduler;
async function getQueueScheduler() {
    return queueScheduler;
}
exports.getQueueScheduler = getQueueScheduler;
//# sourceMappingURL=queue.js.map