import React, { createContext, useRef, useState } from 'react';
import WEBSOCKET_URL, {
  UPLOAD_URL,
  UPLOADED_FILES_URL,
} from '../lib/apiConstants.ts';
import { Props } from './commonModel.ts';
import { Socket } from 'socket.io-client';

interface ContextProps {
  readonly title?: string;
  readonly logoImage?: string;
  readonly logoLink?: string;
  readonly websocketUrl: string;
  readonly uploadUrl: string;
  readonly uploadedFilesUrl?: string;
  readonly reportUrl?: string;
  readonly chartProgressUrl?: string;
  readonly barchartProgressUrl?: string;
  readonly botName?: string;
  readonly exampleQuestions?: string[];
  readonly streaming: boolean;
  readonly showSidebar: boolean;
  readonly supportsSession: boolean;
  readonly defaultQuestionsPrompt?: string;
  readonly historySize?: number;
  readonly showRefreshButton: boolean;
  isConnected?: boolean;
  setIsConnected?: (connected: boolean) => void;
  socket: React.MutableRefObject<Socket | null>;
}

declare global {
  interface Window {
    chatConfig: any;
  }
}

export const ChatContext = createContext<ContextProps>({
  websocketUrl: WEBSOCKET_URL,
  uploadUrl: UPLOAD_URL,
  uploadedFilesUrl: UPLOADED_FILES_URL,
  streaming: false,
  showSidebar: false,
  supportsSession: false,
  showRefreshButton: true,
  historySize: 20,
  socket: { current: null },
});

export const ChatContextProvider = ({ children }: Props) => {
  const { chatConfig } = window;

  const title = chatConfig?.title || 'Chatbot';
  const logoImage = chatConfig?.logoImage;
  const logoLink = chatConfig?.logoLink;
  const websocketUrl = chatConfig?.websocketUrl || WEBSOCKET_URL;
  const uploadUrl = chatConfig?.uploadUrl || UPLOAD_URL;
  const uploadedFilesUrl = chatConfig?.uploadedFilesUrl;
  const reportUrl = chatConfig?.reportUrl;
  const chartProgressUrl = chatConfig?.chartProgressUrl;
  const barchartProgressUrl = chatConfig?.barchartProgressUrl;
  const botName = chatConfig?.botName || 'Bot';
  const exampleQuestions = chatConfig?.exampleQuestions || [];
  const streaming = chatConfig?.streaming;
  const showSidebar = chatConfig?.showSidebar;
  const supportsSession = chatConfig?.supportsSession;
  const showRefreshButton =
    typeof chatConfig?.showRefreshButton === 'undefined'
      ? true
      : chatConfig?.showRefreshButton;
  const historySize = chatConfig?.historySize ?? 20;
  const [isConnected, setIsConnected] = useState(false);
  const socket: React.MutableRefObject<Socket | null> = useRef<Socket | null>(
    null,
  );
  const defaultQuestionsPrompt =
    chatConfig?.defaultQuestionsPrompt ??
    'Please ask us any Onepoint related questions. Things you could ask:';
  return (
    <ChatContext.Provider
      value={{
        title,
        websocketUrl,
        uploadUrl,
        uploadedFilesUrl,
        reportUrl,
        chartProgressUrl,
        barchartProgressUrl,
        botName,
        logoImage,
        logoLink,
        exampleQuestions,
        streaming,
        showSidebar,
        supportsSession,
        showRefreshButton,
        historySize,
        defaultQuestionsPrompt,
        isConnected,
        setIsConnected,
        socket,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
