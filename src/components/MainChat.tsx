import {useContext, useEffect} from 'react';
import {Socket} from 'socket.io-client';
import {ChatContext} from '../context/ChatContext.tsx';
import {Action, MessageContext} from '../context/MessageContext.tsx';
import {useWebsocket} from '../hooks/useWebsocket.ts';
import AppInfo from './AppInfo.tsx';
import Messages from './ChatMessages.tsx';
import ErrorMessage from './ErrorMessage.tsx';
import ChatInput from './ChatInput.tsx';
import Spinner from './Spinner.tsx';
import loadHistory from '../lib/history.ts';
import {debounce} from 'lodash';
import SuggestedResponsePanel from './SuggestedResponsePanel.tsx';
import {ConfigContext} from '../context/ConfigContext.tsx';
import {Message} from '../model/message.ts';
import ConfigScreen from './config/ConfigScreen.tsx';
import TopicTabs from './TopicTabs.tsx';
import RestartDialogue from "./dialogs/RestartDialogue.tsx";

export function scrollToBottom(scrollBehavior: string = 'auto') {
  const chatContainer = document.querySelector('.chat-container');
  if (!!chatContainer) {
    (chatContainer as HTMLElement).style.scrollBehavior = scrollBehavior;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

export function handleMessageDispatch(
  dispatch: React.Dispatch<Action>,
  text: string,
  streaming: boolean,
) {
  dispatch({
    type: 'request',
    message: { text, isUser: true, timestamp: new Date(), finalMessage: false },
  });
  if (streaming) {
    dispatch({
      type: 'startStreaming',
      message: {
        text: '',
        isUser: false,
        timestamp: new Date(),
        finalMessage: false,
      },
    });
  }
}

function hasDataAndSuggestedResponses(data: Message[]) {
  return data && data.length > 0 && data[data.length - 1].suggestedResponses;
}

export default function MainChat() {
  const { websocketUrl, setIsConnected, streaming, historySize } =
    useContext(ChatContext);
  const { state, dispatch } = useContext(MessageContext);
  const { state: configState } = useContext(ConfigContext);
  const socket: React.MutableRefObject<Socket | null> = useWebsocket({
    websocketUrl,
    dispatch,
  });
  const { initConfig } = configState;
  const { data, isLoading, error, connected } = state;

  const debouncedScrollToBottom = debounce(scrollToBottom, 500);

  useEffect(() => {
    const messages = loadHistory(historySize);
    dispatch({ type: 'bulkLoad', messages });
  }, []);

  useEffect(() => {
    debouncedScrollToBottom();
  }, [data]);

  useEffect(() => {
    if (!!setIsConnected) {
      setIsConnected(connected);
    }
  }, [connected]);

  // Hide the question prompt when the user has typed something and streaming is enabled.
  const handleHeader = streaming && !isLoading;

  if (initConfig) {
    return <ConfigScreen />;
  }

  return (
    <>
      <AppInfo
        dispatch={dispatch}
        connected={connected}
        socket={socket}
        expandAppInfo={handleHeader}
      />
      <RestartDialogue />

      {!!error && (
        <ErrorMessage
          message={error}
          clearFunc={() => dispatch({ type: 'clearFailure' })}
        />
      )}
      <TopicTabs />
      <div className="overflow-auto chat-container grow p-4 m-4 bg-white border border-[#d9d9d9] flex flex-col gap-4">
        <Messages />
        {isLoading && <Spinner />}
      </div>
      {hasDataAndSuggestedResponses(data) && (
        <SuggestedResponsePanel
          possibleResponses={data[data.length - 1].suggestedResponses ?? []}
        />
      )}
      {/* Search input */}
      <ChatInput />
    </>
  );
}
