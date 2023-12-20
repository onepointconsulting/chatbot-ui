export type Message = {
  text: string;
  sources?: string;
  isUser: boolean;
  timestamp: Date | string;
};

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
