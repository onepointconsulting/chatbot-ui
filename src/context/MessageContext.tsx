import { State } from '../lib/model.ts';
import { createContext, useReducer } from 'react';
import { Props } from './commonModel.ts';
import { saveHistory } from '../lib/history.ts';
import { Message } from '../model/message.ts';

export type Action =
  | { type: 'request'; message: Message }
  | { type: 'success'; message: Message }
  | { type: 'startStreaming'; message: Message }
  | { type: 'stopStreaming' }
  | { type: 'successStreaming'; message: Message }
  | { type: 'bulkLoad'; messages: Message[] }
  | { type: 'failure'; error: string }
  | { type: 'clearFailure' }
  | { type: 'connect' }
  | { type: 'disconnect' }
  | { type: 'clear' }
  | { type: 'clarify'; token: string };

interface MessageContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

function appendToken(
  messages: Message[],
  token: string,
  field: string,
): Message[] {
  const copy = [...messages];
  const concatMessage = copy[messages.length - 1][field] + token;
  copy[messages.length - 1] = {
    ...copy[messages.length - 1],
    [field]: concatMessage,
  };
  return copy;
}

function isFinished(message: Message) {
  return message.finishedTopicCount === message.topicTotal &&
    message.questionCount === message.totalQuestionsInTopic &&
    message.text.includes('Thank you for');
}

export function messageReducer(state: State, action: Action): State {
  const request = 'request';

  switch (action.type) {
    case 'request':
    case 'success': {
      const message = action.message;
      const lastMessage = state.data[state.data.length - 1];
      if (
        typeof lastMessage === 'undefined' ||
        lastMessage.text !== action.message.text ||
        lastMessage.suggestedResponses?.join('\n') !==
          action.message.suggestedResponses?.join('\n')
      ) {
        saveHistory(message);
        const finished = isFinished(message);
        return {
          ...state,
          isLoading: action.type === request,
          data: [...state.data, message],
          finished,
        };
      }
      const finished = isFinished(message);
      return {
        ...state,
        finished
      };
    }
    case 'startStreaming':
      return {
        ...state,
        isLoading: true,
        data: [...state.data, action.message],
      };
    case 'stopStreaming':
      saveHistory(state.data[state.data.length - 1]);
      return { ...state, isLoading: false };
    case 'successStreaming': {
      const copy = [...state.data];
      // Apend text token to the last message
      const concatMessage =
        copy[state.data.length - 1].text + action.message.text;
      copy[state.data.length - 1] = {
        ...copy[state.data.length - 1],
        text: concatMessage,
      };
      return { ...state, data: [...copy] };
    }
    case 'failure':
      return { ...state, isLoading: false, error: action.error };
    case 'clearFailure':
      return { ...state, error: '' };
    case 'clear':
      const newData =
        state.data.length > 0 ? [state.data[state.data.length - 1]] : [];
      return { ...state, isLoading: false, data: newData, error: '' };
    case 'connect':
      return { ...state, connected: true, error: '' };
    case 'disconnect':
      return { ...state, connected: false };
    case 'bulkLoad':
      return { ...state, data: action.messages };
    case 'clarify':
      return {
        ...state,
        data: appendToken(state.data, action.token, 'clarification'),
      };
    default:
      return state;
  }
}

export const MessageContext = createContext<MessageContextProps>({
  state: {
    data: [],
    isLoading: false,
    connected: false,
    error: '',
    finished: false,
  },
  dispatch: () => null,
});

export const MessageContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(messageReducer, {
    data: [],
    isLoading: false,
    connected: false,
    error: '',
    finished: false,
  });

  return (
    <MessageContext.Provider value={{ state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};
