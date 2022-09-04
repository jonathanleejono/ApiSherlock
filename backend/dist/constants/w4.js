"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redisConfiguration = {
    connection: {
        host: "127.0.0.1",
        port: 6379,
    },
};
const queueName = "pingApiSchedule" + "u2";
const jobName = "apiToPing" + "u2";
const repeatOptions = {
    cron: `* ${new Date().getMinutes()} * * * *`,
};
const myQueue = new bullmq_1.Queue(queueName, redisConfiguration);
new bullmq_1.QueueScheduler(queueName, redisConfiguration);
async function addApiJobToQueue(_) {
    await myQueue.add(jobName, _, { repeat: repeatOptions, delay: 5000 });
}
addApiJobToQueue("https://batterycellify.herokuapp.com");
async function pingApiJobInQueue() {
    console.log(`Pinged "https://batterycellify.herokuapp.com1" in queue.`);
}
const worker = new bullmq_1.Worker(queueName, pingApiJobInQueue, redisConfiguration);
worker.on("completed", async (job) => {
    console.info(`Job ${job.id} has completed!`);
    await myQueue.removeRepeatable(jobName, repeatOptions);
});
worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} has failed with ${err.message}`);
});
//# sourceMappingURL=w4.js.map