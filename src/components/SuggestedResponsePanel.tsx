import { SuggestedResponse } from '../model/message.ts';
import { useContext } from 'react';
import { MessageContext } from '../context/MessageContext.tsx';
import { ChatContext } from '../context/ChatContext.tsx';
import { handleMessageDispatch } from './MainChat.tsx';
import { textSignal } from './ChatInput.tsx';
import sendWSMessage from '../lib/websocketClient.ts';
import BackToBottom from './BackToBottom.tsx';

export default function SuggestedResponsePanel({
  possibleResponses,
}: {
  possibleResponses: SuggestedResponse[];
}) {
  const { socket, streaming } = useContext(ChatContext);
  const { dispatch } = useContext(MessageContext);

  function handleSuggestedResponseClick(response: SuggestedResponse) {
    const text = response.body;
    handleMessageDispatch(dispatch, text, streaming);
    sendWSMessage(text, socket.current);
    textSignal.value = '';
  }

  return (
    <>
      <BackToBottom />
      <div className="grid w-full grid-flow-row grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 px-4 box-border">
        {possibleResponses.map((response, index) => (
          <button
            onClick={() => handleSuggestedResponseClick(response)}
            key={index}
            className={`button-possible-response dark:bg-gray-800`}
            title={response.body}
          >
            <div className="text-left w-full text-[#4a4a4a] dark:text-gray-100 hover:text-[#0084d7]">
              <div className="text-base font-bold">{response.title}</div>
              <div className="text-sm truncate opacity-50">
                {response.subtitle ?? response.body}
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
