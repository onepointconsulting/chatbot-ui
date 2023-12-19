import { Message } from './model.ts';

const HISTORY_KEY = 'history';

const SIZE_LIMIT = 1024 * 1024 * 4; // 4MB

const byteSize = (str: string) => new Blob([str]).size;

export function saveHistory(message: Message) {
  const history = localStorage.getItem(HISTORY_KEY);
  if (history === null) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([message]));
  } else {
    const size = byteSize(history);
    const entries = JSON.parse(history) as Message[];

    if (
      entries[entries.length - 1].timestamp.toString() ===
        message.timestamp.toISOString() &&
      entries[entries.length - 1].text === message.text
    ) {
      // If the last message is the same as the current one, don't save it
      console.warn('Message already saved');
      return;
    }
    if (size > SIZE_LIMIT) {
      entries.shift();
    }
    entries.push(message);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  }
}
