import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext.tsx';
import { Message } from '../../model/message.ts';

/**
 * Button used to clarify a specific question in the chat.
 * @constructor
 */
export default function ClarifyButton({ message }: { message: Message }) {
  const { socket } = useContext(ChatContext);
  const content = {
    topic: '',
    question: message.text,
  };
  if (!message.text.includes('?')) {
    return <></>;
  }
  return (
    <button
      className="rounded-full bg-gray-400 text-white w-6 mr-1 -mt-1"
      title="Explain the current question."
      onClick={() => socket?.current?.emit('clarify', JSON.stringify(content))}
    >
      ?
    </button>
  );
}
