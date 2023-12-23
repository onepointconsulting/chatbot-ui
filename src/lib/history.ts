import {Message} from "../model/message.ts";


const HISTORY_KEY = 'history';

const SIZE_LIMIT = 1024 * 1024 * 4; // 4MB

const byteSize = (str: string) => new Blob([str]).size;

export default function loadHistory(numMessages: number = 20): Message[] {
  const history = localStorage.getItem(HISTORY_KEY);
  if (history === null) {
    return [];
  }

  const entries = JSON.parse(history) as Message[];
  const correctedEntries = entries.map((entry) => {
    if (typeof entry.timestamp === 'string') {
      entry.timestamp = new Date(entry.timestamp);
    }
    return entry;
  });
  const startIndex = Math.max(0, correctedEntries.length - numMessages);
  return correctedEntries.slice(startIndex);
}

export function saveHistory(message: Message) {
  const history = localStorage.getItem(HISTORY_KEY);
  if (history === null) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([message]));
  } else {
    const size = byteSize(history);
    const entries = JSON.parse(history) as Message[];

    if (
      entries[entries.length - 1].timestamp.toString() ===
        (message.timestamp as Date).toISOString() &&
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
