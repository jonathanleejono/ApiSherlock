"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRedisConnection = void 0;
const queue_1 = require("constants/queue");
async function closeRedisConnection() {
    const queueScheduler = await (0, queue_1.getQueueScheduler)();
    await queueScheduler.close();
    await queueScheduler.disconnect();
    const myQueue = await (0, queue_1.getQueue)();
    await myQueue.obliterate();
    await myQueue.close();
    const worker = await (0, queue_1.getQueueWorker)();
    await worker.close();
    await worker.disconnect();
    await new Promise((res) => setTimeout(res, 3500));
}
exports.closeRedisConnection = closeRedisConnection;
//# sourceMappingURL=closeRedisConnection.js.map