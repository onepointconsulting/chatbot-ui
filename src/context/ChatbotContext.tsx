import {createContext, useState} from "react";
import WEBSOCKET_URL, {UPLOAD_URL, UPLOADED_FILES_URL} from "../lib/apiConstants.ts";
import {Props} from "./commonModel.ts";

interface ContextProps {
  readonly title?: string,
  readonly logoImage?: string,
  readonly logoLink?: string,
  readonly websocketUrl: string,
  readonly uploadUrl: string,
  readonly uploadedFilesUrl: string,
  readonly botName?: string,
  isConnected?: boolean,
  setIsConnected?: (connected: boolean) => void,
}

declare global {
  interface Window {
    chatConfig: any;
  }
}

export const ChatContext = createContext<ContextProps>({
  websocketUrl: WEBSOCKET_URL,
  uploadUrl: UPLOAD_URL,
  uploadedFilesUrl: UPLOADED_FILES_URL
})

export const ChatContextProvider = ({children}: Props) => {

  const {chatConfig} = window

  const title = chatConfig?.title || "Chatbot"
  const logoImage = chatConfig?.logoImage
  const logoLink = chatConfig?.logoLink
  const websocketUrl = chatConfig?.websocketUrl || WEBSOCKET_URL
  const uploadUrl = chatConfig?.uploadUrl || UPLOAD_URL
  const uploadedFilesUrl = chatConfig?.uploadedFilesUrl || UPLOAD_URL
  const botName = chatConfig?.botName || "Bot"
  const [isConnected, setIsConnected] = useState(false)
  return (
    <ChatContext.Provider value={{
      title,
      websocketUrl,
      uploadUrl,
      uploadedFilesUrl,
      botName,
      logoImage,
      logoLink,
      isConnected,
      setIsConnected
    }}>{children}</ChatContext.Provider>
  )
}