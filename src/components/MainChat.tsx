import {Message, State} from "../lib/model.ts";
import {useContext, useEffect, useReducer, useRef} from "react";
import {io, Socket} from "socket.io-client";
import sendWSMessage, {WEBSOCKET_RESPONSE} from "../lib/websocketClient.ts";
import ErrorMessage from "./ErrorMessage.tsx";
import Messages from "./ChatMessages.tsx";
import Spinner from "./Spinner.tsx";
import {ChatContext} from "../context/ChatbotContext.tsx";

type Action =
  | { type: 'request', message: Message }
  | { type: 'success', message: Message }
  | { type: 'failure', error: string }
  | { type: 'connect' }
  | { type: 'disconnect' }
  | { type: 'clear' }
  | { type: 'text', text: string }

const request = 'request';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'request':
    case 'success':
      return {...state, text: '', isLoading: action.type === request, data: [...state.data, action.message]};
    case 'failure':
      return {...state, isLoading: false, error: action.error};
    case 'clear':
      return {...state, data: [], error: ""};
    case 'text':
      return {...state, text: action.text};
    case 'connect':
      return {...state, connected: true};
    case 'disconnect':
      return {...state, connected: false};
  }
}

function scrollToBottom() {
  const objDiv = document.querySelector(".chat-container")
  if (!!objDiv) {
    objDiv.scrollTop = objDiv.scrollHeight
  }
}

export default function MainChat() {

  const { title, websocketUrl } = useContext(ChatContext)

  const [{
    text,
    data,
    isLoading,
    error,
    connected
  }, dispatch] = useReducer(reducer, {
    text: "", data: [], isLoading: false, connected: false, error: ""
  });

  const socket = useRef<Socket | null>(null);

  useEffect(() => {

    socket.current = io(websocketUrl)
    const onConnect = () => {
      console.log("connected")
      dispatch({type: 'connect'})
    };

    const onResponse = (value: string) => {
      console.log(WEBSOCKET_RESPONSE, value)
      dispatch({type: 'success', message: {text: value, isUser: false, timestamp: new Date()}})
    };

    const onDisconnect = () => {
      console.log("disconnected")
      dispatch({type: 'disconnect'})
    }

    socket.current.on("connect", onConnect)
    socket.current.on("disconnect", onDisconnect)
    socket.current.on(WEBSOCKET_RESPONSE, onResponse)

    return () => {
      socket.current?.off('connect', onConnect);
      socket.current?.off('disconnect', onDisconnect);
      socket.current?.off(WEBSOCKET_RESPONSE, onResponse);
    }
  }, []);

  useEffect(() => {
    scrollToBottom()
  }, [data])

  function sendMessage() {
    dispatch({type: 'request', message: {text, isUser: true, timestamp: new Date()}})
    sendWSMessage(text, socket.current)
  }

  function sendEnterMessage(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      dispatch({type: 'request', message: {text, isUser: true, timestamp: new Date()}})
      sendWSMessage(text, socket.current)
    }
  }

  function clear() {
    dispatch({type: 'clear'})
  }

  return (
    <>
      <section className="chat-main flex flex-col h-screen">
        <div className="chat-header p-2 bg-black text-white fixed w-full flex justify-between">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          {<div className="mt-auto">{connected ? "connected" : "disconnected"}</div>}
        </div>
        {!!error && <ErrorMessage message={error}/>}
        <div className="chat-container grow bg-gray-100 mt-14 overflow-auto">
          <Messages data={data}/>
          {isLoading && <Spinner />}
        </div>
        <div className="chat-input flex">
          <input type="text"
                 value={text}
                 onChange={(e) => dispatch({type: 'text', text: e.target.value})}
                 onKeyUp={sendEnterMessage}
                 placeholder="Type your message here and press ENTER ..."
                 disabled={isLoading || !connected}
                 className="m-3 text-gray-900 text-sm rounded-lg block w-full p-2.5
                  outline outline-offset-2 outline-1 focus:outline-offset-2 focus:outline-2 outline-gray-400"/>
          <button
            className="flex-none ml-1 mr-2 my-auto bg-sky-500 hover:bg-sky-700 px-5 text-sm font-semibold text-white h-10 rounded-2xl"
            disabled={isLoading || !text || !connected}
            onClick={sendMessage}>Send
          </button>
          <button
            className="flex-none ml-1 mr-2 my-auto bg-amber-500 hover:bg-amber-700 px-5 text-sm font-semibold text-white h-10 rounded-2xl"
            onClick={clear}>
            Clear
          </button>
        </div>
      </section>
    </>
  )
}
