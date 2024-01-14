import React, {useContext, useEffect} from 'react';
import {io, Socket} from 'socket.io-client';
import {
  sendStartSession,
  WEBSOCKET_COMMAND,
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTION_ERROR,
  WEBSOCKET_CONNECTION_FAILED,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_SERVER_MESSAGE,
  WEBSOCKET_STOP_STREAMING_RESPONSE,
} from '../lib/websocketClient.ts';
import {ChatContext} from '../context/ChatContext.tsx';
import {Action} from '../context/MessageContext.tsx';
import {saveSession} from '../lib/sessionFunctions.ts';
import {ConfigContext} from '../context/ConfigContext.tsx';

type useWebsocketParams = {
  websocketUrl: string;
  dispatch: React.Dispatch<Action>;
};

export function useWebsocket({
                               websocketUrl,
                               dispatch,
                             }: useWebsocketParams): React.MutableRefObject<Socket | null> {
  const {socket} = useContext(ChatContext);
  const {streaming} = useContext(ChatContext);
  const {dispatch: configDispatch, state} = useContext(ConfigContext);
  const {startSession} = state;

  useEffect(() => {
    if(!!startSession) {
      // Start the session after the configuration is finished.
      sendStartSession(socket.current);
    }
  }, [startSession]);

  useEffect(() => {
    socket.current = io(websocketUrl);
    const onConnect = () => {
      console.log('connected');
      dispatch({type: 'connect'});
      // Handle session
      sendStartSession(socket.current);
    };

    const onResponse = (value: string) => {
      const {response, sources, sessionId, suggestions} = JSON.parse(value);
      dispatch({
        type: streaming ? 'successStreaming' : 'success',
        message: {
          text: response,
          suggestedResponses: suggestions,
          sources,
          isUser: false,
          timestamp: new Date(),
          sessionId,
        },
      });
    };

    const onDisconnect = () => {
      console.log('disconnected');
      dispatch({type: 'disconnect'});
    };

    const onStopStreaming = () => {
      dispatch({type: 'stopStreaming'});
    };

    function handleErrors(err: Error) {
      dispatch({type: 'failure', error: err.message || 'Unknown error'});
      console.error(err);
    }

    function onStartSession(value: string) {
      if (!value) return;
      saveSession({id: value, timestamp: new Date()});
    }

    function onSelectTopics(configData: string) {
      if (!configData) return;
      const data = JSON.parse(configData);
      data.quizz_modes = data.quizz_modes.map((e: any) => ({
        name: e.name,
        questionCount: e.question_count,
      }));
      configDispatch({type: 'initConfig', data});
    }

    function onQuizConfigurationSaveOk() {
      configDispatch({type: 'saveQuizConfigurationOk'});
    }

    function onQuizConfigurationSaveError(data: string) {
      const {response} = JSON.parse(data);
      configDispatch({type: 'saveQuizConfigurationError', data: response});
    }

    const onConnectionError = (err: Error) => handleErrors(err);
    const onConnectionFailed = (err: Error) => handleErrors(err);

    socket.current.on(WEBSOCKET_CONNECT, onConnect);
    socket.current.on(WEBSOCKET_DISCONNECT, onDisconnect);

    socket.current.on(WEBSOCKET_CONNECTION_ERROR, onConnectionError);
    socket.current.on(WEBSOCKET_CONNECTION_FAILED, onConnectionFailed);

    socket.current.on(WEBSOCKET_SERVER_MESSAGE, onResponse);
    socket.current.on(WEBSOCKET_STOP_STREAMING_RESPONSE, onStopStreaming);

    socket.current.on(WEBSOCKET_COMMAND.START_SESSION, onStartSession);
    socket.current.on(WEBSOCKET_COMMAND.QUIZ_CONFIGURATION, onSelectTopics);
    socket.current.on(
      WEBSOCKET_COMMAND.QUIZ_CONFIGURATION_SAVE_OK,
      onQuizConfigurationSaveOk,
    );
    socket.current.on(
      WEBSOCKET_COMMAND.QUIZ_CONFIGURATION_SAVE_ERROR,
      onQuizConfigurationSaveError,
    );

    return () => {
      socket.current?.off(WEBSOCKET_CONNECT, onConnect);
      socket.current?.off(WEBSOCKET_DISCONNECT, onDisconnect);

      socket.current?.off(WEBSOCKET_CONNECTION_ERROR, onConnectionError);
      socket.current?.off(WEBSOCKET_CONNECTION_FAILED, onConnectionFailed);

      socket.current?.off(WEBSOCKET_SERVER_MESSAGE, onResponse);
      socket.current?.off(WEBSOCKET_STOP_STREAMING_RESPONSE, onStopStreaming);

      socket.current?.off(WEBSOCKET_COMMAND.START_SESSION, onStartSession);
      socket.current?.off(WEBSOCKET_COMMAND.QUIZ_CONFIGURATION, onSelectTopics);
      socket.current?.off(
        WEBSOCKET_COMMAND.QUIZ_CONFIGURATION_SAVE_OK,
        onQuizConfigurationSaveOk,
      );
      socket.current?.off(
        WEBSOCKET_COMMAND.QUIZ_CONFIGURATION_SAVE_ERROR,
        onQuizConfigurationSaveError,
      );
    };
  }, []);
  return socket;
}
