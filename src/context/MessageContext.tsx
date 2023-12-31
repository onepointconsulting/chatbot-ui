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
  | { type: 'clear' };

interface MessageContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function messageReducer(state: State, action: Action): State {
  const request = 'request';

  switch (action.type) {
    case 'request':
    case 'success':
      // TODO: remove this line after debugging
      // action.message.suggestedResponses = [{title: "Yes", subtitle: "That is affirmative", text: "Yes"}, {title: "No", subtitle: "That is a no", text: "No"}, {title: "Maybe", subtitle: "That could be true or not", text: "Maybe"}]
      saveHistory(action.message);
      return {
        ...state,
        isLoading: action.type === request,
        data: [...state.data, action.message],
      };
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
      return { ...state, isLoading: false, data: [], error: '' };
    case 'connect':
      return { ...state, connected: true, error: '' };
    case 'disconnect':
      return { ...state, connected: false };
    case 'bulkLoad':
      return { ...state, data: action.messages };
    default:
      return state;
  }
}

export const MessageContext = createContext<MessageContextProps>({
  state: { data: [], isLoading: false, connected: false, error: '' },
  dispatch: () => null,
});

export const MessageContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(messageReducer, {
    data: [],
    isLoading: false,
    connected: false,
    error: '',
  });

  return (
    <MessageContext.Provider value={{ state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};
