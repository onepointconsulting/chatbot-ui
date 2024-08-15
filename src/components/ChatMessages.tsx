import { useContext } from 'react';
import { Socket } from 'socket.io-client';
import { ChatContext } from '../context/ChatContext.tsx';
import { MessageContext } from '../context/MessageContext.tsx';
import sendWSMessage from '../lib/websocketClient.ts';
import { handleMessageDispatch } from './MainChat.tsx';
import Sources from './Sources.tsx';
import { Message } from '../model/message.ts';
import ClarifyButton from './buttons/ClarifyButton.tsx';
import MarkdownSection from './markdown/Markdown.tsx';

const HIGHLIGHT_COLOR = 'bg-[#f6f6f6] dark:bg-slate-700';

function processHighlighting(message: Message) {
  return message.finalMessage
    ? 'bg-green-50 dark:bg-green-900'
    : message.isUser
      ? ''
      : HIGHLIGHT_COLOR;
}

// Display the messages in the chat window
function MessageDisplay({
  index,
  isLast,
  message,
  botName,
  uploadedFilesUrl,
}: {
  index: number;
  isLast: boolean;
  message: Message;
  botName: string | undefined;
  uploadedFilesUrl?: string;
  socket: React.MutableRefObject<Socket | null>;
}) {
  const { socket, streaming, showRefreshButton } = useContext(ChatContext);
  const { dispatch } = useContext(MessageContext);
  const userStyle = message.isUser ? 'text-[#4a4a4a]' : '';

  // Not fixed yet. onsubmit is not picking up the text value
  function reSubmit() {
    const messageText = message.text;
    console.log('messageText', messageText);
    handleMessageDispatch(dispatch, messageText, streaming);
    sendWSMessage(messageText, socket.current);
  }

  return (
    <section className="" key={`message_${index}`}>
      <div
        className={`${
          message.isUser
            ? 'user-chat-message text-[#4a4a4a] dark:text-gray-100 dark:bg-gray-800'
            : ''
        } chat-message flex flex-row gap-2 p-4 ${processHighlighting(message)}`}
      >
        {/* User profile/avatar */}
        <div className="flex-none text-sm text-center text-gray-500 min-w-24">
          <img
            src={message.isUser ? '/d-wise-user.svg' : '/d-wise-bot.svg'}
            alt={message.isUser ? 'user' : botName}
            className="w-5 h-6 mx-auto md:w-7 md:h-8"
          />
        </div>

        <div className="flex flex-col gap-2 grow">
          {/* Username/date */}
          <div className="flex flex-col w-full text-[#4a4a4a] dark:text-gray-100">
            <div
              className={`${userStyle} flex flex-row justify-between w-full`}
            >
              <span className="text-sm font-bol dark:text-gray-100 dar">
                {message.isUser ? 'You' : message.topic}
              </span>
            </div>

            <span className={`text-xs ${userStyle}`}>
              {message.questionCount && (
                <span className="mr-6 text-sm">
                  Topic {message.finishedTopicCount} out of {message.topicTotal}{' '}
                  - question {message.questionCount} out of{' '}
                  {message.totalQuestionsInTopic}
                </span>
              )}
            </span>
          </div>

          {/* Response text */}
          <div
            className={`chat-message flex flex-row ${processHighlighting(
              message,
            )}`}
          >
            <section className="w-full">
              <MarkdownSection content={message.text} userStyle={userStyle} />
              {!!uploadedFilesUrl && <Sources message={message} />}
            </section>
          </div>

          {/* Handle the buttons */}
          {!message.isUser && (
            <div className="float-left w-full">
              {/* Clarify button */}
              <div className="flex justify-start">
                {!message.clarification && isLast && (
                  <ClarifyButton message={message} />
                )}
              </div>
            </div>
          )}

          {message.clarification && !message.isUser && (
            <div className="w-full px-6">
              <MarkdownSection content={message.clarification} userStyle={''} />
            </div>
          )}
        </div>

        {/* ReSubmit the history */}
        {message.isUser && showRefreshButton && (
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
  const { botName, uploadedFilesUrl, socket } = useContext(ChatContext);
  const { state } = useContext(MessageContext);
  const { currentTopic } = state;
  const messagesLength = state?.data?.length || 0;
  return (
    <>
      {state?.data
        .map((message, index) => {
          return { message: message, index: index };
        })
        .filter((messageIndex, index) => {
          const message = messageIndex['message'];
          return (
            message.topic === currentTopic ||
            (index > 0 && state.data[index - 1].topic === currentTopic) ||
            (message.finalMessage &&
              state.data[index - 2].topic === currentTopic)
          );
        })
        .map((messageIndex) => {
          const message = messageIndex['message'];
          const index = messageIndex['index'];
          return (
            <MessageDisplay
              index={index}
              isLast={index === messagesLength - 1}
              message={message}
              botName={botName}
              uploadedFilesUrl={uploadedFilesUrl}
              socket={socket}
              key={`message_${index}`}
            />
          );
        })}
    </>
  );
}
