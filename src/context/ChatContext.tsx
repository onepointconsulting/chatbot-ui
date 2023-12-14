import { createContext, useState } from 'react';
import WEBSOCKET_URL, {
  UPLOAD_URL,
  UPLOADED_FILES_URL,
} from '../lib/apiConstants.ts';
import { Props } from './commonModel.ts';

interface ContextProps {
  readonly title?: string;
  readonly logoImage?: string;
  readonly logoLink?: string;
  readonly websocketUrl: string;
  readonly uploadUrl: string;
  readonly uploadedFilesUrl: string;
  readonly botName?: string;
  readonly exampleQuestions?: string[];
  readonly streaming: boolean;
  readonly showSidebar: boolean;
  readonly defaultQuestionsPrompt?: string;
  isConnected?: boolean;
  setIsConnected?: (connected: boolean) => void;
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
});

export const ChatContextProvider = ({ children }: Props) => {
  const { chatConfig } = window;

  const title = chatConfig?.title || 'Chatbot';
  const logoImage = chatConfig?.logoImage;
  const logoLink = chatConfig?.logoLink;
  const websocketUrl = chatConfig?.websocketUrl || WEBSOCKET_URL;
  const uploadUrl = chatConfig?.uploadUrl || UPLOAD_URL;
  const uploadedFilesUrl = chatConfig?.uploadedFilesUrl;
  const botName = chatConfig?.botName || 'Bot';
  const exampleQuestions = chatConfig?.exampleQuestions || [];
  const streaming = chatConfig?.streaming;
  const showSidebar = chatConfig?.showSidebar;
  const [isConnected, setIsConnected] = useState(false);
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
        botName,
        logoImage,
        logoLink,
        exampleQuestions,
        streaming,
        showSidebar,
        defaultQuestionsPrompt,
        isConnected,
        setIsConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
