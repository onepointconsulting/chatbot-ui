import {createContext, ReactNode} from "react";
import WEBSOCKET_URL from "../lib/apiConstants.ts";

interface ContextProps {
  readonly title?: string,
  readonly websocketUrl: string,
  readonly botName?: string,
}

declare global {
  interface Window {
    chatConfig: any;
  }
}

export const ChatContext = createContext<ContextProps>({websocketUrl: WEBSOCKET_URL})

interface Props {
  children?: ReactNode
}

export const ChatContextProvider = ({children}: Props) => {
  const title = window.chatConfig?.title || "Chatbot"
  const websocketUrl = window.chatConfig?.websocketUrl || WEBSOCKET_URL
  const botName = window.chatConfig?.botName || "Bot"
  return (
    <ChatContext.Provider value={{title, websocketUrl, botName}}>{children}</ChatContext.Provider>
  )
}