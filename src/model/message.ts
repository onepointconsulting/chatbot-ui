export type Message = {
  text: string;
  sources?: string;
  isUser: boolean;
  timestamp: Date | string;
};