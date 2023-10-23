import './App.css'
import {useEffect, useReducer, useRef} from "react";
import sendWSMessage, {WEBSOCKET_RESPONSE} from "./lib/websocketClient.ts";
import {io, Socket} from "socket.io-client";
import WEBSOCKET_URL from "./lib/apiConstants.ts";
import {Message, State} from "./lib/model.ts";
import Messages from "./components/ChatMessages.tsx";

type Action =
  | { type: 'request', message: Message }
  | { type: 'success', message: Message }
  | { type: 'failure', error: string }
  | { type: 'connect' }
  | { type: 'disconnect' }
  | { type: 'clear', error: string }
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
  if(!!objDiv) {
    objDiv.scrollTop = objDiv.scrollHeight
  }
}

function App() {

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

    socket.current = io(WEBSOCKET_URL)
    const onConnect = () => {
      console.log("connected")
      dispatch({type: 'connect'})
    };

    const onResponse = (value: string) => {
      console.log(WEBSOCKET_RESPONSE, value)
      dispatch({type: 'success', message: {text: value, isUser: false}})
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
    dispatch({type: 'request', message: {text, isUser: true}})
    sendWSMessage(text, socket.current)
  }

  return (
    <>
      <section className="chat-main flex flex-col h-screen">
        <div className="chat-header p-2 bg-black text-white fixed w-full flex justify-between">
          <h2 className="text-3xl md:text-4xl font-bold">Chat</h2>
          {<div className="mt-auto">{connected ? "connected" : "disconnected"}</div>}
        </div>
        <div className="chat-container grow bg-gray-100 mt-14 overflow-auto">
          <Messages data={data}/>
          {isLoading && <div className="chat-message flex flex-col">
            <span className="text-sm text-gray-500 mx-3 my-3">Please wait ...</span>
          </div>}
        </div>
        <div className="chat-input flex">
          <input type="text"
                 value={text}
                 onChange={(e) => dispatch({type: 'text', text: e.target.value})}
                 onKeyUp={(e) => {
                   if (e.key === 'Enter') {
                     sendMessage()
                   }
                 }}
                 placeholder="Type your message here ..."
                 disabled={isLoading || !connected}
                 className="m-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <button
            className="flex-none ml-1 mr-2 my-auto bg-sky-500 hover:bg-sky-700 px-5 text-sm font-semibold text-white h-10 rounded-2xl"
            disabled={isLoading || !text || !connected}
            onClick={sendMessage}>Send
          </button>
        </div>
      </section>
    </>
  )
}

export default App
