import {Message, State} from "../lib/model.ts";
import {useContext, useEffect, useReducer, useRef} from "react";
import sendWSMessage from "../lib/websocketClient.ts";
import ErrorMessage from "./ErrorMessage.tsx";
import Messages from "./ChatMessages.tsx";
import SpinnerComment from "./SpinnerComment.tsx";
import {ChatContext} from "../context/ChatbotContext.tsx";
import {useWebsocket} from "../hooks/useWebsocket.ts";
import AppInfo from "./AppInfo.tsx";
import {Socket} from "socket.io-client";

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
      return {...state, connected: true, error: ""};
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

  const {websocketUrl, setIsConnected} = useContext(ChatContext)
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [{
    text,
    data,
    isLoading,
    error,
    connected
  }, dispatch] = useReducer(reducer, {
    text: "", data: [], isLoading: false, connected: false, error: ""
  });

  const socket: React.MutableRefObject<Socket | null> = useWebsocket({websocketUrl, dispatch})

  useEffect(() => {
    scrollToBottom()
  }, [data])

  useEffect(() => {
    if(!!setIsConnected) {
      setIsConnected(connected)
    }
  }, [connected])

  function sendMessage() {
    dispatch({type: 'request', message: {text, isUser: true, timestamp: new Date()}})
    sendWSMessage(text, socket.current)
  }

  function resetHeight() {
    textAreaRef.current!.style.height = `3rem`
  }

  function sendEnterMessage(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!e.shiftKey && e.key === 'Enter' && text.trim().length > 0) {
      sendMessage()
      resetHeight()
    } else {
      const el = e.target as HTMLTextAreaElement
      if(text.includes("\n")) {
        textAreaRef.current!.style.height = `auto`
        textAreaRef.current!.style.height = `${el.scrollHeight}px`
      } else {
        resetHeight()
      }
    }
  }

  function clear() {
    dispatch({type: 'clear'})
  }

  return (
    <>
      <AppInfo dispatch={dispatch} connected={connected} socket={socket}/>
      {!!error && <ErrorMessage message={error} clearFunc={() => dispatch({type: 'clearFailure'})}/>}
      <div className="chat-container grow overflow-auto">
        <Messages data={data}/>
        {isLoading && <SpinnerComment/>}
      </div>
      <div className="chat-input flex">
        <textarea aria-invalid="false"
                  autoComplete="false"
                  id="chat-input"
                  placeholder="Type your message here and press ENTER..."
                  value={text}
                  onChange={(e) => dispatch({type: 'text', text: e.target.value})}
                  onKeyUp={sendEnterMessage}
                  disabled={isLoading || !connected}
                  className="m-3 text-gray-900 text-sm rounded-lg block w-full px-3 py-4 h-12 overflow-hidden max-h-44 resize-none
                  outline outline-offset-2 outline-1 focus:outline-offset-2 focus:outline-2 outline-gray-400"
                  ref={textAreaRef}
        ></textarea>
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
    </>
  )
}
