import { Message } from '../model/message.ts';

export type State = {
  text: string;
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
