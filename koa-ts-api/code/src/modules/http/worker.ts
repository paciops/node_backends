import { Worker, isMainThread, parentPort } from 'worker_threads';
import send from '../data-aggregation/services/send';
import node from '../../config/node';

let worker: Worker;

// if env == 'test' then jest is running and throws an error
// when Worker class is called with __dirname
if (isMainThread && node.env !== 'test') {
  worker = new Worker(__dirname);
} else {
  parentPort?.on('message', send);
}

export function sendToThread(value: unknown) {
  worker?.postMessage(value);
}
