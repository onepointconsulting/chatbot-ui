
export type Message = {
  text: string;
  sources?: string;
  isUser: boolean;
  timestamp: Date;
};

export type State = {
  text: string,
  data: Message[];
  isLoading: boolean;
  error?: string;
  connected: boolean;
}