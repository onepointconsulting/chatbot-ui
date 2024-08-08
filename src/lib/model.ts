import { Message } from '../model/message.ts';

export type Topic = {
  name: string;
  checked: boolean;
};

export type QuizMode = {
  name: string;
  questionCount: number;
  enabled?: boolean;
};

export type State = {
  data: Message[];
  isLoading: boolean;
  error?: string;
  connected: boolean;
  finished: boolean;
};

export type UploadedFile = {
  date: string;
  name: string;
  relative_url: string;
};

export type ConfigState = {
  initConfig: boolean;
  startSession?: boolean;
  topics: Topic[];
  selectAllTopics: boolean;
  quizzModes: QuizMode[];
  questionCount: number;
  savePending: boolean;
  successMessage?: string;
  errorMessage?: string;
};
