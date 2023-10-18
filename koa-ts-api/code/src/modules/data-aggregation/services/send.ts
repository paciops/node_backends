import { setTimeout } from 'timers/promises';

export default async function send(payload: unknown): Promise<void> {
  await setTimeout(2000);
  console.log('event sent', payload);
}
