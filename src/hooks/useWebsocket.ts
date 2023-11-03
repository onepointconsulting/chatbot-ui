import React, {useEffect, useRef} from "react";
import {io, Socket} from "socket.io-client";
import {WEBSOCKET_RESPONSE} from "../lib/websocketClient.ts";
import {Action} from "../components/MainChat.tsx";

type useWebsocketParams = {
  websocketUrl: string,
  dispatch: React.Dispatch<Action>
}

export function useWebsocket({websocketUrl, dispatch}: useWebsocketParams): React.MutableRefObject<Socket | null> {
  const socket: React.MutableRefObject<Socket | null> = useRef<Socket | null>(null);

  useEffect(() => {

    socket.current = io(websocketUrl)
    const onConnect = () => {
      console.log("connected")
      dispatch({type: 'connect'})
    };

    const onResponse = (value: string) => {
      console.log(WEBSOCKET_RESPONSE, value)
      const {response, sources} = JSON.parse(value)
      dispatch({
        type: 'success', message: {
          text: response,
          sources,
          isUser: false, timestamp: new Date()
        }
      })
    };

    const onDisconnect = () => {
      console.log("disconnected")
      dispatch({type: 'disconnect'})
    }

    function handleErrors(err: Error) {
      dispatch({type: 'failure', error: err.message || 'Unknown error'})
      console.error(err)
    }

    socket.current.on("connect", onConnect)
    socket.current.on("disconnect", onDisconnect)
    socket.current.on('connect_error', err => handleErrors(err))
    socket.current.on('connect_failed', err => handleErrors(err))
    socket.current.on(WEBSOCKET_RESPONSE, onResponse)

    return () => {
      socket.current?.off('connect', onConnect);
      socket.current?.off('disconnect', onDisconnect);
      socket.current?.off(WEBSOCKET_RESPONSE, onResponse);
    }
  }, []);
  return socket
}