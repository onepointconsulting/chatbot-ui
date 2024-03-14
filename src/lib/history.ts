import { Message } from '../model/message.ts';

export const HISTORY_KEY = 'history';

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
    const lastMessage = entries[entries.length - 1];
    if (
      entries.length > 0 &&
      lastMessage.text === message.text
    ) {
      lastMessage.timestamp = (
        message.timestamp as Date
      ).toISOString();
      lastMessage.clarification = message.clarification;
      // If the last message is the same as the current one, don't save it
      console.warn('Message already saved. Updated timestamp');
    } else {
      if (size > SIZE_LIMIT) {
        entries.shift();
      }
      entries.push(message);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  }
}
