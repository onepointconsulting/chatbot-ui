import {createContext} from "react";
import WEBSOCKET_URL from "../lib/apiConstants.ts";
import {Props} from "./commonModel.ts";

interface ContextProps {
  readonly title?: string,
  readonly logoImage?: string,
  readonly logoLink?: string,
  readonly websocketUrl: string,
  readonly botName?: string,
}

declare global {
  interface Window {
    chatConfig: any;
  }
}

export const ChatContext = createContext<ContextProps>({websocketUrl: WEBSOCKET_URL})

export const ChatContextProvider = ({children}: Props) => {

  const { chatConfig } = window

  const title = chatConfig?.title || "Chatbot"
  const logoImage = chatConfig?.logoImage
  const logoLink = chatConfig?.logoLink
  const websocketUrl = chatConfig?.websocketUrl || WEBSOCKET_URL
  const botName = chatConfig?.botName || "Bot"
  return (
    <ChatContext.Provider value={{title, websocketUrl, botName, logoImage, logoLink}}>{children}</ChatContext.Provider>
  )
}