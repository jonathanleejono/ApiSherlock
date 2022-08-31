import { Queue, RepeatOptions } from "bullmq";

export const queueBaseName = "pingApiScheduleQueue";

export const jobBaseName = "pingApisJob";

//eslint-disable-next-line
let myQueue: Queue<any, any, string>;

let repeatOptions: RepeatOptions;

//eslint-disable-next-line
export async function setQueue(queue: Queue<any, any, string>) {
  myQueue = queue;
}

export async function getQueue() {
  return myQueue;
}

export function setRepeatOptions(options: RepeatOptions) {
  repeatOptions = options;
}

export async function getRepeatOptions() {
  return repeatOptions;
}
