
export type SuggestedResponse = {
  title: string;
  subtitle?: string;
  text: string;
}

export type Message = {
  text: string;
  sources?: string;
  suggestedResponses?: SuggestedResponse[];
  isUser: boolean;
  timestamp: Date | string;
  sessionId?: string;
};
