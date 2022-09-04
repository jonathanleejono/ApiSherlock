import { Queue, QueueScheduler, RepeatOptions, Worker } from "bullmq";

export const queueBaseName = "pingApiScheduleQueue";

export const jobBaseName = "pingApisJob";

//eslint-disable-next-line
let myQueue: Queue<any, any, string>;

let repeatOptions: RepeatOptions;

let queueWorker: Worker<any, void, string>;

let queueScheduler: QueueScheduler;

//eslint-disable-next-line
export async function setQueue(queue: Queue<any, any, string>) {
  myQueue = queue;
}

//eslint-disable-next-line
export async function getQueue(): Promise<Queue<any, any, string>> {
  return myQueue;
}

export function setRepeatOptions(options: RepeatOptions) {
  repeatOptions = options;
}

export async function getRepeatOptions(): Promise<RepeatOptions> {
  return repeatOptions;
}

//eslint-disable-next-line
export async function setQueueWorker(
  newQueueWorker: Worker<any, void, string>
) {
  queueWorker = newQueueWorker;
}

export async function getQueueWorker(): Promise<Worker<any, void, string>> {
  return queueWorker;
}

export function setQueueScheduler(newQueueScheduler: QueueScheduler) {
  queueScheduler = newQueueScheduler;
}

export async function getQueueScheduler(): Promise<QueueScheduler> {
  return queueScheduler;
}
