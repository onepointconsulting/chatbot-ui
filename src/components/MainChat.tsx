import {Message, State} from "../lib/model.ts";
import {useContext, useEffect, useReducer} from "react";
import sendWSMessage from "../lib/websocketClient.ts";
import ErrorMessage from "./ErrorMessage.tsx";
import Messages from "./ChatMessages.tsx";
import Spinner from "./Spinner.tsx";
import {ChatContext} from "../context/ChatbotContext.tsx";
import Header from "./Header.tsx";
import {useWebsocket} from "../hooks/useWebsocket.ts";

export type Action =
  | { type: 'request', message: Message }
  | { type: 'success', message: Message }
  | { type: 'failure', error: string }
  | { type: 'clearFailure' }
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
    case 'clearFailure':
      return {...state, error: ""};
    case 'clear':
      return {...state, isLoading: false, data: [], error: ""};
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

  const {title, logoImage, websocketUrl} = useContext(ChatContext)

  const [{
    text,
    data,
    isLoading,
    error,
    connected
  }, dispatch] = useReducer(reducer, {
    text: "", data: [], isLoading: false, connected: false, error: ""
  });

  const socket = useWebsocket({websocketUrl, dispatch})

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
      <section className="chat-main flex flex-col">
        <Header title={title} logoImage={logoImage} connected={connected}/>
        {!!error && <ErrorMessage message={error} dispatch={dispatch}/>}
        <div className="chat-container grow bg-gray-100 overflow-auto">
          <Messages data={data}/>
          {isLoading && <Spinner/>}
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
            className="flex-none my-auto hover:bg-gray-100 rounded-full"
            disabled={isLoading || !text || !connected}
            onClick={sendMessage}><img src="/send.svg" alt="Send" style={{width: "42px"}}/>
          </button>
          <button
            className="flex-none my-auto pl-1 pr-2 h-10 rounded-2xl"
            onClick={clear}>
            <img src="/clear.svg" alt="Clear" style={{width: "42px"}}/>
          </button>
        </div>
      </section>
    </>
  )
}
