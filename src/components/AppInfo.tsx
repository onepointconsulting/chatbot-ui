import { signal } from '@preact/signals-react';
import { handleMessageDispatch } from './MainChat.tsx';
import { Socket } from 'socket.io-client';
import sendWSMessage from '../lib/websocketClient.ts';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext.tsx';
import { Action } from '../context/MessageContext.tsx';

const displayInfo = signal(true);
function ListItem({
  question,
  index,
  connected,
  dispatch,
  socket,
}: {
  question: string;
  index: number;
  dispatch: React.Dispatch<Action>;
  connected: boolean;
  socket: React.MutableRefObject<Socket | null>;
}) {
  const { exampleQuestions, streaming } = useContext(ChatContext);
  if (!exampleQuestions) return <></>;
  return (
    <div
      className={`text-sm text-gray-500 mb-${
        index === exampleQuestions.length - 1 ? '3' : '1'
      }`}
    >
      <a
        href="#"
        onClick={(e) => {
          if (connected) {
            handleMessageDispatch(dispatch, question, streaming);
            sendWSMessage(question, socket.current);
          }
          e.preventDefault();
        }}
        className="underline"
      >
        {question}
      </a>
    </div>
  );
}

export default function AppInfo({
  dispatch,
  connected,
  socket,
  handleHeader,
}: {
  dispatch: React.Dispatch<Action>;
  connected: boolean;
  socket: React.MutableRefObject<Socket | null>;
  handleHeader: boolean;
}) {
  const { exampleQuestions, defaultQuestionsPrompt } = useContext(ChatContext);
  if (!exampleQuestions || exampleQuestions.length === 0) return <></>;
  return (
    <div className="h-auto pl-4 md:pl-[3.1rem] lg:pl-[3.6rem] bg-gray-100 border-l-4 border-blue-400">
      <details
        className="w-full [&_img]:open:-rotate-180 open"
        {...(handleHeader ? { open: true } : { open: false })}
      >
        {/* Related question items */}
        {handleHeader ? (
          <div className="w-fit pl-[10px] transition-all scale-x-105 opacity-100 md:pl-[16px] lg:pl-[22px] xl:pl-[32px] 2xl:pl-8 open:scale-x-0 open:opacity-0">
            {displayInfo.value &&
              exampleQuestions?.map((question: string, index: number) => (
                <ListItem
                  key={`question_${index}`}
                  question={question}
                  index={index}
                  socket={socket}
                  dispatch={dispatch}
                  connected={connected}
                />
              ))}
          </div>
        ) : (
          <></>
        )}

        {/* Expander icon for the prompt question */}
        <summary className="flex items-center justify-between w-full py-2 pr-2 cursor-pointer">
          {/* Default questions prompt */}
          <h1 className="text-xl font-bold text-gray-500 md:text-2xl">
            {defaultQuestionsPrompt}
          </h1>

          <div title="transition-all duration-300 transform rotate-0">
            <img src="/expand-down.svg" alt="Expander icon" />
          </div>
        </summary>
      </details>
    </div>
  );
}
