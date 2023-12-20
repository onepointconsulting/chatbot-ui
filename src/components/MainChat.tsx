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

function scrollToBottom() {
  const objDiv = document.querySelector('.chat-container');
  if (!!objDiv) {
    objDiv.scrollTop = objDiv.scrollHeight;
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
  const { websocketUrl, setIsConnected, streaming } = useContext(ChatContext);
  const { state, dispatch } = useContext(MessageContext);
  const { data, isLoading, error, connected } = state;

  const socket: React.MutableRefObject<Socket | null> = useWebsocket({
    websocketUrl,
    dispatch,
  });

  useEffect(() => {
    const messages = loadHistory(20);
    dispatch({ type: 'bulkLoad', messages });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  useEffect(() => {
    if (!!setIsConnected) {
      setIsConnected(connected);
    }
  }, [connected]);

  // Hide the question prompt when the user has typed something and streaming is enabled.
  const handleHeader = streaming && !isLoading;

  return (
    <>
      <AppInfo
        dispatch={dispatch}
        connected={connected}
        socket={socket}
        expandAppInfo={handleHeader}
      />
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

      {/* Search input */}
      <SearchInput />
    </>
  );
}
