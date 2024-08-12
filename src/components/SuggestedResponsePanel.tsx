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
      <div className="grid w-full grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2 px-4 box-border">
        {possibleResponses.map((response, index) => (
          <button
            onClick={() => handleSuggestedResponseClick(response)}
            key={index}
            className={`button-possible-response`}
            title={response.body}
          >
            <div className="text-left w-full text-[#4a4a4a] hover:text-[#0084d7]">
              <div className="font-bold text-base">{response.title}</div>
              <div className="truncate text-sm opacity-50">
                {response.subtitle ?? response.body}
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
