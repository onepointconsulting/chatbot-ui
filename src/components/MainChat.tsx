import { Message, State } from "../lib/model.ts";
import { useContext, useEffect, useReducer, useRef } from "react";
import sendWSMessage from "../lib/websocketClient.ts";
import ErrorMessage from "./ErrorMessage.tsx";
import Messages from "./ChatMessages.tsx";
import SpinnerComment from "./SpinnerComment.tsx";
import { ChatContext } from "../context/ChatContext.tsx";
import { useWebsocket } from "../hooks/useWebsocket.ts";
import AppInfo from "./AppInfo.tsx";
import { Socket } from "socket.io-client";

const request = "request";

export type Action =
  | { type: "request"; message: Message }
  | { type: "success"; message: Message }
  | { type: "startStreaming"; message: Message }
  | { type: "stopStreaming" }
  | { type: "successStreaming"; message: Message }
  | { type: "failure"; error: string }
  | { type: "clearFailure" }
  | { type: "connect" }
  | { type: "disconnect" }
  | { type: "clear" }
  | { type: "text"; text: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "request":
    case "success":
      return {
        ...state,
        text: "",
        isLoading: action.type === request,
        data: [...state.data, action.message],
      };
    case "startStreaming":
      return {
        ...state,
        text: "",
        isLoading: true,
        data: [...state.data, action.message],
      };
    case "stopStreaming":
      return { ...state, isLoading: false };
    case "successStreaming": {
      const copy = [...state.data];
      const concatMessage =
        copy[state.data.length - 1].text + action.message.text;
      copy[state.data.length - 1] = {
        ...copy[state.data.length - 1],
        text: concatMessage,
      };
      return { ...state, text: "", data: [...copy] };
    }
    case "failure":
      return { ...state, isLoading: false, error: action.error };
    case "clearFailure":
      return { ...state, error: "" };
    case "clear":
      return { ...state, isLoading: false, data: [], error: "" };
    case "text":
      return { ...state, text: action.text };
    case "connect":
      return { ...state, connected: true, error: "" };
    case "disconnect":
      return { ...state, connected: false };
  }
}

function scrollToBottom() {
  const objDiv = document.querySelector(".chat-container");
  if (!!objDiv) {
    objDiv.scrollTop = objDiv.scrollHeight;
  }
}

export function handleMessageDispatch(
  dispatch: React.Dispatch<Action>,
  text: string,
  streaming: boolean
) {
  dispatch({
    type: "request",
    message: { text, isUser: true, timestamp: new Date() },
  });
  if (streaming) {
    dispatch({
      type: "startStreaming",
      message: { text: "", isUser: false, timestamp: new Date() },
    });
  }
}

export default function MainChat() {
  const { websocketUrl, setIsConnected, streaming } = useContext(ChatContext);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [{ text, data, isLoading, error, connected }, dispatch] = useReducer(
    reducer,
    {
      text: "",
      data: [],
      isLoading: false,
      connected: false,
      error: "",
    }
  );

  const socket: React.MutableRefObject<Socket | null> = useWebsocket({
    websocketUrl,
    dispatch,
  });

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  useEffect(() => {
    if (!!setIsConnected) {
      setIsConnected(connected);
    }
  }, [connected]);

  const disabled = isLoading || !text || !connected;
  // Hide the question prompt when the user has typed something and streaming is enabled.

  const handleHeader = !!streaming && !isLoading;

  function sendMessage() {
    handleMessageDispatch(dispatch, text, streaming);
    sendWSMessage(text, socket.current);
  }

  function resetHeight() {
    textAreaRef.current!.style.height = `3rem`;
  }

  function sendEnterMessage(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!e.shiftKey && e.key === "Enter" && text.trim().length > 0) {
      sendMessage();
      resetHeight();
    } else {
      const el = e.target as HTMLTextAreaElement;
      if (text.includes("\n")) {
        textAreaRef.current!.style.height = `auto`;
        textAreaRef.current!.style.height = `${el.scrollHeight}px`;
      } else {
        resetHeight();
      }
    }
  }

  function clear() {
    dispatch({ type: "clear" });
  }

  return (
    <>
      {/* Related questions/prompt */}
      <AppInfo
        handleHeader={handleHeader}
        dispatch={dispatch}
        connected={connected}
        socket={socket}
      />

      {!!error && (
        <ErrorMessage
          message={error}
          clearFunc={() => dispatch({ type: "clearFailure" })}
        />
      )}

      <div className="overflow-auto chat-container grow">
        <Messages data={data} isLoading={isLoading} />
        {isLoading && <SpinnerComment />}
      </div>

      <div className="flex chat-input">
        <textarea
          aria-invalid="false"
          autoComplete="false"
          id="chat-input"
          placeholder="Type your message here and press ENTER..."
          value={text}
          onChange={(e) => dispatch({ type: "text", text: e.target.value })}
          onKeyUp={sendEnterMessage}
          disabled={isLoading || !connected}
          className="block w-full h-12 px-3 py-3 m-3 overflow-hidden text-sm text-gray-900 rounded-lg resize-none md:py-3 max-h-44 outline outline-offset-2 outline-1 focus:outline-offset-2 focus:outline-2 outline-gray-400"
          ref={textAreaRef}
        ></textarea>

        {/* Send button */}
        <button
          className={`flex-none my-auto rounded-full hover:transform hover:bg-scale-100 hover:duration-200 ${
            disabled ? "bg-gray-200" : "bg-blue-200"
          }`}
          disabled={disabled}
          onClick={sendMessage}
        >
          <img src="/send.svg" alt="Send" style={{ width: "42px" }} />
        </button>

        {/* Clear button */}
        <button
          className="flex-none h-10 pl-1 pr-2 my-auto hover:transform rounded-2xl hover:bg-scale-100 hover:duration-200"
          onClick={clear}
        >
          <img src="/clear.svg" alt="Clear" style={{ width: "42px" }} />
        </button>
      </div>
    </>
  );
}
