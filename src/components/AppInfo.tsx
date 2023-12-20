import {handleMessageDispatch} from './MainChat.tsx';
import {Socket} from 'socket.io-client';
import sendWSMessage from '../lib/websocketClient.ts';
import {useContext} from 'react';
import {ChatContext} from '../context/ChatContext.tsx';
import {Action} from '../context/MessageContext.tsx';
import {signal} from "@preact/signals-react";

const KEY_EXPAND_APP_INFO = 'expandAppInfo';

const displayInfo = signal(window.localStorage[KEY_EXPAND_APP_INFO] === 'true');

function handleExpandAppInfo() {
  window.localStorage[KEY_EXPAND_APP_INFO] =
    !window.localStorage[KEY_EXPAND_APP_INFO] ? 'false' :
      window.localStorage[KEY_EXPAND_APP_INFO] === 'true' ? 'false' : 'true'
  displayInfo.value = window.localStorage[KEY_EXPAND_APP_INFO] === 'true';
}

function changeAppInfoState(expandAppInfo: boolean) {
  if(!expandAppInfo) {
    return false
  }
  return displayInfo.value;
}

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
  const {exampleQuestions, streaming} = useContext(ChatContext);
  if (!exampleQuestions) return <></>;
  return (
    <div
      className={`bg-white p-2 rounded-md my-1 text-sm text-[#A6A6A6] hover:bg-blue-50 hover:text-gray-600 hover:duration-300  mb-${
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
                                  expandAppInfo,
                                }: {
  dispatch: React.Dispatch<Action>;
  connected: boolean;
  socket: React.MutableRefObject<Socket | null>;
  expandAppInfo: boolean;
}) {
  const shouldExpandAppInfo = changeAppInfoState(expandAppInfo);
  console.log('shouldExpandAppInfo', shouldExpandAppInfo)
  const {exampleQuestions, defaultQuestionsPrompt} = useContext(ChatContext);
  if (!exampleQuestions || exampleQuestions.length === 0) return <></>;
  return (
    <div className="pr-4 lg:pr-0 h-auto pl-4 md:pl-[3.1rem] lg:pl-[3.6rem] bg-[#339ddf] border-l-4 border-blue-400">
      {/* Expander icon for the prompt question */}
      <div className="flex items-center justify-between w-full py-2 pl-4 pr-2 cursor-pointer"
           onClick={handleExpandAppInfo}>
        {/* Default questions prompt */}
        <h1 className="text-xl font-bold text-white md:text-2xl">
          {defaultQuestionsPrompt}
        </h1>

        <div title="transition-all duration-300 transform rotate-0">
          <img
            className="w-8"
            src="/expand-down.svg"
            alt="Expander icon"
            style={{
              filter: 'invert(1)',
            }}
          />
        </div>
      </div>
      {shouldExpandAppInfo && <div
        className="w-full [&_img]:open:-rotate-180"
      >
        {/* Related question items */}

        <div
          className="w-fit pl-[10px] transition-all  scale-x-105 opacity-100 md:pl-[16px] lg:pl-[22px] xl:pl-[32px] 2xl:pl-8 open:scale-x-0 open:opacity-0">
          {exampleQuestions?.map((question: string, index: number) => (
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

      </div>}
    </div>
  );
}
