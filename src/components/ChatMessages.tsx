import type { ReactNode } from 'react';
import { useContext, useState } from 'react';
import Markdown from 'react-markdown';
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Socket } from 'socket.io-client';
import type { Position } from 'unist';
import { ChatContext } from '../context/ChatContext.tsx';
import { MessageContext } from '../context/MessageContext.tsx';
import { Message } from '../lib/model.ts';
import Sources from './Sources.tsx';

export type ComponentPropsWithoutRef<T extends React.ElementType<any>> =
  import('react').ComponentPropsWithoutRef<T>;

export type ReactMarkdownProps = {
  node: Element;
  children: ReactNode[];
  /**
   * Passed when `options.rawSourcePos` is given
   */
  sourcePosition?: Position;
  /**
   * Passed when `options.includeElementIndex` is given
   */
  index?: number;
  /**
   * Passed when `options.includeElementIndex` is given
   */
  siblingCount?: number;
};

export type CodeProps = ComponentPropsWithoutRef<'code'> &
  ReactMarkdownProps & {
    inline?: boolean;
  };

function Code({ inline, children, ...props }: CodeProps) {
  const match = /language-(\w+)/.exec(props.className || '') || 'Python';
  return (
    <SyntaxHighlighter
      {...props}
      children={String(children).replace(/\n$/, '')}
      style={dracula}
      customStyle={{ paddingRight: '2.5em' }}
      wrapLongLines
      language={match[1]}
      PreTag="div"
    />
  );
}

// Handle the copy button
async function handleCopy(
  text: string,
  setCopied: (value: ((prevState: boolean) => boolean) | boolean) => void,
) {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  } else {
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
}

// Copy button
function CopyButton({ message }: { message: Message }) {
  const { state } = useContext(MessageContext);
  const [copied, setCopied]: [
    boolean,
    (value: ((prevState: boolean) => boolean) | boolean) => void,
  ] = useState(false);
  const text =
    message.text + (!!message.sources ? `\n\nSources: ${message.sources}` : '');
  if (state.isLoading) return <div />; // don't show copy button while loading
  return (
    <div className="flex justify-start py-3 mr-3">
      {/* Copy button */}

      <svg
        width="21"
        height="21"
        viewBox="0 0 19 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={async () => await handleCopy(text, setCopied)}
        className="transform rounded-md cursor-pointer hover:scale-105 hover:duration-300 hover:ease-in-out"
      >
        <path
          d="M14.0938 0C14.0124 0 6.21875 0 6.21875 0C4.83011 0 3.59376 1.27379 3.59376 2.62502L2.83513 2.64273C1.44716 2.64273 0.3125 3.89878 0.3125 5.25V18.375C0.3125 19.7262 1.54888 21 2.93752 21H12.7813C14.1699 21 15.4063 19.7262 15.4063 18.375H16.0625C17.4511 18.375 18.6875 17.1013 18.6875 15.75V5.26576L14.0938 0ZM12.7813 19.6875H2.93752C2.24845 19.6875 1.62502 19.0438 1.62502 18.375V5.25C1.62502 4.58129 2.18612 3.95916 2.87518 3.95916L3.59376 3.93751V15.75C3.59376 17.1013 4.83011 18.375 6.21875 18.375H14.0938C14.0938 19.0438 13.4703 19.6875 12.7813 19.6875ZM17.375 15.75C17.375 16.4187 16.7516 17.0625 16.0625 17.0625H6.21875C5.52968 17.0625 4.90625 16.4187 4.90625 15.75V2.62502C4.90625 1.95631 5.52968 1.31252 6.21875 1.31252H12.7813C12.7707 2.82387 12.7813 3.95393 12.7813 3.95393C12.7813 5.31762 14.0084 6.56252 15.4063 6.56252C15.4063 6.56252 16.1032 6.56252 17.375 6.56252V15.75ZM15.4063 5.25C14.7074 5.25 14.0938 3.98017 14.0938 3.29898C14.0938 3.29898 14.0938 2.60859 14.0938 1.33285V1.33153L17.375 5.25H15.4063ZM14.0938 9.19934H8.18752C7.82527 9.19934 7.53127 9.49268 7.53127 9.85492C7.53127 10.2172 7.82527 10.5105 8.18752 10.5105H14.0938C14.456 10.5105 14.75 10.2171 14.75 9.85492C14.75 9.49268 14.456 9.19934 14.0938 9.19934ZM14.0938 12.4773H8.18752C7.82527 12.4773 7.53127 12.7706 7.53127 13.1329C7.53127 13.4951 7.82527 13.7885 8.18752 13.7885H14.0938C14.456 13.7885 14.75 13.4951 14.75 13.1329C14.75 12.7706 14.456 12.4773 14.0938 12.4773Z"
          fill="#A6A6A6"
        />
      </svg>

      {/* Display the Copied to clipboard text */}
      {copied && (
        <span className="mx-4 text-sm text-gray-400">Copied to clipboard!</span>
      )}
    </div>
  );
}

// Back to bottom button
function BackToBottom() {
  // Handle the back to bottom button with smooth scrolling
  const scrollToBottom = () => {
    const chatContainer = document.querySelector(
      '.chat-container',
    ) as HTMLElement;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
      chatContainer.style.scrollBehavior = 'smooth';
    }
  };

  return (
    <button
      className="absolute hover:scale-105 hover:duration-200 transform z-10 text-gray-600 border rounded-full cursor-pointer right-1/2 border-black/10 bg-blue-400 bottom-[7.25rem] translate-x-[-50%]"
      onClick={scrollToBottom}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="m-1 text-white"
      >
        <path
          d="M17 13L12 18L7 13M12 6L12 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </button>
  );
}

const highlightColor = 'bg-white';

function processHighlighting(message: Message) {
  return message.isUser ? '' : highlightColor;
}

// Display the messages in the chat window
function MessageDisplay({
  index,
  message,
  botName,
  uploadedFilesUrl,
}: {
  index: number;
  message: Message;
  botName: string | undefined;
  uploadedFilesUrl: string;
  socket: React.MutableRefObject<Socket | null>;
}) {
  const isUser = message.isUser ? 'text-white' : '';

  return (
    <section className="mx-5" key={`message_${index}`}>
      <div
        className={`${
          message.isUser ? 'bg-[#339DDF] text-white my-8' : ''
        } chat-message py-4 flex flex-row rounded-2xl ${processHighlighting(
          message,
        )}`}
      >
        {/* User profile/avatar */}
        <div className="flex-none mt-3 ml-4 text-sm text-center text-gray-500 min-w-24">
          <img
            src={message.isUser ? '/user.png' : '/bot.png'}
            alt={message.isUser ? 'user' : botName}
            className="w-6 h-6 mx-auto md:w-8 md:h-8"
          />
        </div>

        <div className="mr-5 grow">
          {/* Username/date */}
          <div className="flex flex-col ml-3">
            <span className={`${isUser} mt-3 text-sm font-bold`}>
              {message.isUser ? 'You' : botName}
            </span>
            <span className={`text-xs text-gray-400 ${isUser}`}>
              {message?.timestamp?.toLocaleTimeString()}
            </span>
          </div>

          {/* Response text */}
          <div
            className={`chat-message flex flex-row mt-1 mx-3 ${processHighlighting(
              message,
            )}`}
          >
            <section>
              <Markdown
                className={`mt-1 text-gray-900 markdown-body ${isUser}`}
                remarkPlugins={[remarkGfm]}
                components={{
                  ul: ({ ...props }) => (
                    <ul
                      className="mb-3 ml-5 space-y-1 text-gray-500 list-disc dark:text-gray-400"
                      {...props}
                    />
                  ),
                  ol: ({ ...props }) => (
                    <ol
                      className="mx-4 my-3 space-y-3 text-gray-500 list-decimal dark:text-gray-400"
                      {...props}
                    />
                  ),
                  li: ({ ...props }) => <li className="mt-0" {...props} />,
                  p: ({ ...props }) => (
                    <p className="pb-1 font-sans" {...props} />
                  ),
                  a: ({ children, ...props }) => (
                    <a
                      className="pb-4 font-sans underline sm:pb-2"
                      {...props}
                      target="_blank"
                    >
                      {children}
                    </a>
                  ),
                  code({ ...props }) {
                    // @ts-ignore
                    return <Code {...props} />;
                  },
                }}
              >
                {message.text}
              </Markdown>
              {!!uploadedFilesUrl && <Sources message={message} />}
            </section>
          </div>

          {/* Handle the copy button */}
          <div className="float-left w-full">
            {/* Copy button */}
            {!message.isUser && <CopyButton message={message} />}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Displays the messages in the chat window
 * @constructor
 */
export default function Messages() {
  const { botName, uploadedFilesUrl, socket } = useContext(ChatContext);
  const { state } = useContext(MessageContext);

  return (
    <>
      {state?.data.map((message: Message, index: number) => {
        return (
          <MessageDisplay
            index={index}
            message={message}
            botName={botName}
            uploadedFilesUrl={uploadedFilesUrl}
            socket={socket}
            key={`message_${index}`}
          />
        );
      })}

      <BackToBottom />
    </>
  );
}
