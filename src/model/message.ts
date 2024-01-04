export type SuggestedResponse = {
  title: string;
  subtitle?: string;
  body: string;
};

export type Message = {
  text: string;
  sources?: string;
  suggestedResponses?: SuggestedResponse[];
  isUser: boolean;
  timestamp: Date | string;
  sessionId?: string;
};
