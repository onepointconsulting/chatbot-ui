import { useContext, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Socket } from 'socket.io-client';
import { ChatContext } from '../context/ChatContext.tsx';
import { MessageContext } from '../context/MessageContext.tsx';
import sendWSMessage from '../lib/websocketClient.ts';
import { CodeProps } from '../model/chatMessage.ts';
import { handleMessageDispatch, scrollToBottom } from './MainChat.tsx';
import Sources from './Sources.tsx';
import { Message } from '../model/message.ts';

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
  console.log('message.text', message);
  return (
    <div className="flex justify-start py-3 mx-3">
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

  return (
    <button
      className="absolute hover:scale-105 hover:duration-200 transform z-10 text-gray-600 border rounded-full cursor-pointer border-black/10 bg-blue-400 bottom-[5.6rem] left-1/2 -translate-x-1/2"
      onClick={() => scrollToBottom('smooth')}
      title="Back to bottom"
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
  uploadedFilesUrl?: string;
  socket: React.MutableRefObject<Socket | null>;
}) {
  const { socket, streaming } = useContext(ChatContext);
  const { dispatch } = useContext(MessageContext);
  const isUser = message.isUser ? 'text-white' : '';

  // Not fixed yet. onsubmit is not picking up the text value
  function reSubmit() {
    const messageText = message.text;
    console.log('messageText', messageText);
    handleMessageDispatch(dispatch, messageText, streaming);
    sendWSMessage(messageText, socket.current);
  }

  return (
    <section className="mx-2 lg:mx-5 mt-2" key={`message_${index}`}>
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
              {message?.timestamp instanceof Date
                ? message.timestamp.toLocaleString()
                : message?.timestamp}
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

        {/* ReSubmit the history */}
        {message.isUser && (
          <button
            className="w-auto p-2 mx-4 bg-blue-500 rounded-full h-fit"
            onClick={() => reSubmit()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

/**
 * Displays the messages in the chat window
 * @constructor
 */
export default function Messages() {
  const [isChatAtBottom, setIsChatAtBottom] = useState<boolean>(false);
  const { botName, uploadedFilesUrl, socket } = useContext(ChatContext);
  const { state } = useContext(MessageContext);
  const { isLoading } = state;

  // Handle the scroll to the bottom button.
  useEffect(() => {
    const feedContainer = document.querySelector(
      '.chat-container',
    ) as HTMLElement;

    const handleScroll = () => {
      if (!!feedContainer) {
        const isAtBottom =
          feedContainer.scrollHeight - feedContainer.scrollTop ===
          feedContainer.clientHeight;
        setIsChatAtBottom(isAtBottom);
      }
    };

    // Listen for the scroll event on the chat container
    feedContainer.addEventListener('scroll', handleScroll);

    return () => {
      // Remove the event listener when the component unmounts
      feedContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

      {!isLoading && !isChatAtBottom && <BackToBottom />}
    </>
  );
}
