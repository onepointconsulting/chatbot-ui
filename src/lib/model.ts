
export type Message = {
  text: string;
  isUser: boolean;
};

export type State = {
  text: string,
  data: Message[];
  isLoading: boolean;
  error?: string;
  connected: boolean;
}