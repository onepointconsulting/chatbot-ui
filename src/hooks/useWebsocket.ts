import React, { useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  STOP_STREAMING_RESPONSE,
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTION_ERROR,
  WEBSOCKET_CONNECTION_FAILED,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_RESPONSE,
} from '../lib/websocketClient.ts';
import { ChatContext } from '../context/ChatContext.tsx';
import { Action } from '../context/MessageContext.tsx';

type useWebsocketParams = {
  websocketUrl: string;
  dispatch: React.Dispatch<Action>;
};

export function useWebsocket({
  websocketUrl,
  dispatch,
}: useWebsocketParams): React.MutableRefObject<Socket | null> {
  const {socket} = useContext(ChatContext);
  const { streaming } = useContext(ChatContext);

  useEffect(() => {
    socket.current = io(websocketUrl);
    const onConnect = () => {
      console.log('connected');
      dispatch({ type: 'connect' });
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

    const handleStopStreaming = () => {
      dispatch({ type: 'stopStreaming' });
    };

    function handleErrors(err: Error) {
      dispatch({ type: 'failure', error: err.message || 'Unknown error' });
      console.error(err);
    }

    const handleConnectionError = (err: Error) => handleErrors(err);
    const handleConnectionFailed = (err: Error) => handleErrors(err);

    socket.current.on(WEBSOCKET_CONNECT, onConnect);
    socket.current.on(WEBSOCKET_DISCONNECT, onDisconnect);

    socket.current.on(WEBSOCKET_CONNECTION_ERROR, handleConnectionError);
    socket.current.on(WEBSOCKET_CONNECTION_FAILED, handleConnectionFailed);

    socket.current.on(WEBSOCKET_RESPONSE, onResponse);
    socket.current.on(STOP_STREAMING_RESPONSE, handleStopStreaming);

    return () => {
      socket.current?.off(WEBSOCKET_CONNECT, onConnect);
      socket.current?.off(WEBSOCKET_DISCONNECT, onDisconnect);

      socket.current?.off(WEBSOCKET_CONNECTION_ERROR, handleConnectionError);
      socket.current?.off(WEBSOCKET_CONNECTION_FAILED, handleConnectionFailed);

      socket.current?.off(WEBSOCKET_RESPONSE, onResponse);
      socket.current?.off(STOP_STREAMING_RESPONSE, handleStopStreaming);
    };
  }, []);
  return socket;
}
