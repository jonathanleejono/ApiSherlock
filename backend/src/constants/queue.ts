import { Queue, RepeatOptions } from "bullmq";

let myQueue: Queue<any, any, string>;

let repeatOptions: RepeatOptions;

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
