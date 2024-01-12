import { Message } from '../model/message.ts';

export type Topic = {
  name: string;
  checked: boolean;
}

export type State = {
  data: Message[];
  isLoading: boolean;
  error?: string;
  connected: boolean;
};

export type UploadedFile = {
  date: string;
  name: string;
  relative_url: string;
};

export type ConfigState = {
  selectTopics: boolean;
  topics: Topic[];
}