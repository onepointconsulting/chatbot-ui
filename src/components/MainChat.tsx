import { useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ChatContext } from '../context/ChatContext.tsx';
import { Action, MessageContext } from '../context/MessageContext.tsx';
import { useWebsocket } from '../hooks/useWebsocket.ts';
import AppInfo from './AppInfo.tsx';
import Messages from './ChatMessages.tsx';
import ErrorMessage from './ErrorMessage.tsx';
import SearchInput from './SearchInput.tsx';
import Spinner from './Spinner.tsx';
import loadHistory from '../lib/history.ts';
import { debounce } from 'lodash';
import ClearDialog from './dialogs/ClearDialog.tsx';
import SuggestedResponsePanel from './SuggestedResponsePanel.tsx';
import ConfigDialog from './dialogs/ConfigDialog.tsx';
import { ConfigContext } from '../context/ConfigContext.tsx';

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
    message: { text, isUser: true, timestamp: new Date() },
  });
  if (streaming) {
    dispatch({
      type: 'startStreaming',
      message: { text: '', isUser: false, timestamp: new Date() },
    });
  }
}

export default function MainChat() {
  const { websocketUrl, setIsConnected, streaming, historySize } =
    useContext(ChatContext);
  const { state, dispatch } = useContext(MessageContext);
  const { state: configState } = useContext(ConfigContext);
  const { initConfig } = configState;
  const { data, isLoading, error, connected } = state;

  const socket: React.MutableRefObject<Socket | null> = useWebsocket({
    websocketUrl,
    dispatch,
  });

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
    return <ConfigDialog />;
  }

  return (
    <>
      <AppInfo
        dispatch={dispatch}
        connected={connected}
        socket={socket}
        expandAppInfo={handleHeader}
      />
      <ClearDialog />

      {!!error && (
        <ErrorMessage
          message={error}
          clearFunc={() => dispatch({ type: 'clearFailure' })}
        />
      )}
      <div className="overflow-auto chat-container grow bg-[#E6F3FB]">
        <Messages />
        {isLoading && <Spinner />}
      </div>
      {data && data.length > 0 && data[data.length - 1].suggestedResponses && (
        <SuggestedResponsePanel
          possibleResponses={data[data.length - 1].suggestedResponses ?? []}
        />
      )}
      {/* Search input */}
      <SearchInput />
    </>
  );
}
