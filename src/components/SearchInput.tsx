import {useContext, useRef} from "react";
import {MessageContext} from "../context/MessageContext.tsx";
import sendWSMessage from "../lib/websocketClient.ts";
import {handleMessageDispatch} from "./MainChat.tsx";
import {ChatContext} from "../context/ChatContext.tsx";
import {Socket} from "socket.io-client";
import {useWebsocket} from "../hooks/useWebsocket.ts";

export default function SearchInput() {
  const { websocketUrl, streaming } = useContext(ChatContext);
  const {state, dispatch} = useContext(MessageContext);
  const {text, connected, isLoading} = state;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const socket: React.MutableRefObject<Socket | null> = useWebsocket({
    websocketUrl,
    dispatch,
  });

  function resetHeight() {
    textAreaRef.current!.style.height = `3rem`;
  }

  function sendMessage() {
    handleMessageDispatch(dispatch, text, streaming);
    sendWSMessage(text, socket.current);
  }

  function sendEnterMessage(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!e.shiftKey && e.key === 'Enter' && text.trim().length > 0) {
      sendMessage();
      resetHeight();
    } else {
      const el = e.target as HTMLTextAreaElement;
      if (text.includes('\n')) {
        textAreaRef.current!.style.height = `auto`;
        textAreaRef.current!.style.height = `${el.scrollHeight}px`;
      } else {
        resetHeight();
      }
    }
  }

  function clear() {
    dispatch({ type: 'clear' });
  }

  const disabled = isLoading || !text || !connected;

  return (
    <div className="sticky bottom-0 flex w-full bg-gray-100 chat-input rounded-tr-3xl rounded-tl-3xl">
        <textarea
          aria-invalid="false"
          autoComplete="false"
          id="chat-input"
          placeholder="Type your message here and press ENTER..."
          value={text}
          onChange={(e) => dispatch({type: 'text', text: e.target.value})}
          onKeyUp={sendEnterMessage}
          disabled={isLoading || !connected}
          className="block w-full h-12 px-2 py-2 m-3 overflow-hidden text-sm text-gray-900 rounded-lg resize-none md:py-3 max-h-44 outline outline-offset-2 outline-1 focus:outline-offset-2 focus:outline-2 outline-gray-400"
          ref={textAreaRef}
        ></textarea>

      {/* Send button */}
      <button
        className={`flex-none my-auto rounded-full hover:transform hover:bg-scale-100 hover:duration-200 ${
          disabled ? 'bg-gray-200' : 'bg-blue-200'
        }`}
        disabled={disabled}
        onClick={sendMessage}
      >
        <img src="/send.svg" alt="Send" style={{width: '42px'}}/>
      </button>

      {/* Clear button */}
      <button
        className="flex-none h-10 pl-1 pr-2 my-auto hover:transform rounded-2xl hover:bg-scale-100 hover:duration-200"
        onClick={clear}
      >
        <img src="/clear.svg" alt="Clear" style={{width: '42px'}}/>
      </button>
    </div>
  )
}