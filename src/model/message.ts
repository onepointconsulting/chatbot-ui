export type SuggestedResponse = {
  title: string;
  subtitle?: string;
  body: string;
};

export type Message = {
  text: string;
  sources?: string;
  clarification?: string;
  suggestedResponses?: SuggestedResponse[];
  isUser: boolean;
  timestamp: Date | string;
  sessionId?: string;
  topic?: string;
  finishedTopicCount?: number;
  topicTotal?: number;
  questionCount?: number;
  totalQuestionsInTopic?: number;
};
