import { getQueue, getQueueScheduler, getQueueWorker } from "constants/queue";

//this is to close connections to prevent memory leaks
export async function closeRedisConnection() {
  //this all has to be here in this exact order
  const queueScheduler = await getQueueScheduler();
  await queueScheduler.close();
  const myQueue = await getQueue();
  await myQueue.obliterate();
  await myQueue.close();
  const worker = await getQueueWorker();
  await worker.close();
  await worker.disconnect();

  //this needs to be here to wait for connections to properly close
  await new Promise((res) => setTimeout(res, 3000));
}
