import { Message, State } from '../lib/model.ts';
import { createContext, useReducer } from 'react';
import { Props } from './commonModel.ts';
import { saveHistory } from '../lib/history.ts';

export type Action =
  | { type: 'request'; message: Message }
  | { type: 'success'; message: Message }
  | { type: 'startStreaming'; message: Message }
  | { type: 'stopStreaming' }
  | { type: 'successStreaming'; message: Message }
  | { type: 'failure'; error: string }
  | { type: 'clearFailure' }
  | { type: 'connect' }
  | { type: 'disconnect' }
  | { type: 'clear' }
  | { type: 'text'; text: string };

interface MessageContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function messageReducer(state: State, action: Action): State {
  const request = 'request';

  switch (action.type) {
    case 'request':
    case 'success':
      saveHistory(action.message);
      return {
        ...state,
        text: '',
        isLoading: action.type === request,
        data: [...state.data, action.message],
      };
    case 'startStreaming':
      return {
        ...state,
        text: '',
        isLoading: true,
        data: [...state.data, action.message],
      };
    case 'stopStreaming':
      saveHistory(state.data[state.data.length - 1]);
      return { ...state, isLoading: false };
    case 'successStreaming': {
      const copy = [...state.data];
      const concatMessage =
        copy[state.data.length - 1].text + action.message.text;
      copy[state.data.length - 1] = {
        ...copy[state.data.length - 1],
        text: concatMessage,
      };
      return { ...state, text: '', data: [...copy] };
    }
    case 'failure':
      return { ...state, isLoading: false, error: action.error };
    case 'clearFailure':
      return { ...state, error: '' };
    case 'clear':
      return { ...state, isLoading: false, data: [], error: '' };
    case 'text':
      return { ...state, text: action.text };
    case 'connect':
      return { ...state, connected: true, error: '' };
    case 'disconnect':
      return { ...state, connected: false };
  }
}

export const MessageContext = createContext<MessageContextProps>({
  state: { text: '', data: [], isLoading: false, connected: false, error: '' },
  dispatch: () => null,
});

export const MessageContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(messageReducer, {
    text: '',
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
