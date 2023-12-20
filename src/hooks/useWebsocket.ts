import React, { useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  WEBSOCKET_STOP_STREAMING_RESPONSE,
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTION_ERROR,
  WEBSOCKET_CONNECTION_FAILED,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_RESPONSE,
  WEBSOCKET_START_SESSION,
  sendStartSession,
} from '../lib/websocketClient.ts';
import { ChatContext } from '../context/ChatContext.tsx';
import { Action } from '../context/MessageContext.tsx';
import { saveSession } from '../lib/sessionFunctions.ts';

type useWebsocketParams = {
  websocketUrl: string;
  dispatch: React.Dispatch<Action>;
};

export function useWebsocket({
  websocketUrl,
  dispatch,
}: useWebsocketParams): React.MutableRefObject<Socket | null> {
  const { socket } = useContext(ChatContext);
  const { streaming } = useContext(ChatContext);

  useEffect(() => {
    socket.current = io(websocketUrl);
    const onConnect = () => {
      console.log('connected');
      dispatch({ type: 'connect' });
      // Handle session
      sendStartSession(socket.current);
    };

    const onResponse = (value: string) => {
      console.log(WEBSOCKET_RESPONSE, value);
      const { response, sources } = JSON.parse(value);
      dispatch({
        type: streaming ? 'successStreaming' : 'success',
        message: {
          text: response,
          sources,
          isUser: false,
          timestamp: new Date(),
        },
      });
    };

    const onDisconnect = () => {
      console.log('disconnected');
      dispatch({ type: 'disconnect' });
    };

    const onStopStreaming = () => {
      dispatch({ type: 'stopStreaming' });
    };

    function handleErrors(err: Error) {
      dispatch({ type: 'failure', error: err.message || 'Unknown error' });
      console.error(err);
    }

    function onStartSession(value: string) {
      debugger;
      if (!value) return;
      saveSession({ id: value, timestamp: new Date() });
    }

    const onConnectionError = (err: Error) => handleErrors(err);
    const onConnectionFailed = (err: Error) => handleErrors(err);

    socket.current.on(WEBSOCKET_CONNECT, onConnect);
    socket.current.on(WEBSOCKET_DISCONNECT, onDisconnect);

    socket.current.on(WEBSOCKET_CONNECTION_ERROR, onConnectionError);
    socket.current.on(WEBSOCKET_CONNECTION_FAILED, onConnectionFailed);

    socket.current.on(WEBSOCKET_RESPONSE, onResponse);
    socket.current.on(WEBSOCKET_STOP_STREAMING_RESPONSE, onStopStreaming);

    socket.current.on(WEBSOCKET_START_SESSION, onStartSession);

    return () => {
      socket.current?.off(WEBSOCKET_CONNECT, onConnect);
      socket.current?.off(WEBSOCKET_DISCONNECT, onDisconnect);

      socket.current?.off(WEBSOCKET_CONNECTION_ERROR, onConnectionError);
      socket.current?.off(WEBSOCKET_CONNECTION_FAILED, onConnectionFailed);

      socket.current?.off(WEBSOCKET_RESPONSE, onResponse);
      socket.current?.off(WEBSOCKET_STOP_STREAMING_RESPONSE, onStopStreaming);

      socket.current?.off(WEBSOCKET_START_SESSION, onStartSession);
    };
  }, []);
  return socket;
}
