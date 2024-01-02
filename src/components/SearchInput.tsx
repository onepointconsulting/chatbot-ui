import { useContext, useRef } from 'react';
import { ChatContext } from '../context/ChatContext.tsx';
import { MessageContext } from '../context/MessageContext.tsx';
import sendWSMessage, { sendStopStream } from '../lib/websocketClient.ts';
import { handleMessageDispatch } from './MainChat.tsx';
import ClearButton from './buttons/ClearButton.tsx';
import ReportDownload from './buttons/ReportDownload.tsx';
import { signal } from '@preact/signals-react';

const textSignal = signal('');

// Stop streaming button
function StopStreaming() {
  const { socket } = useContext(ChatContext);
  return (
    <button
      onClick={() => {
        sendStopStream(socket.current);
      }}
      type="button"
      className="absolute right-0 bottom-[0.6rem] z-50 p-1 mb-3 border-2 border-blue-300 rounded-full hover:bg-gray-200 hover:duration-200"
      aria-label="Stop streaming"
      title="Stop streaming"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="#0084D7"
        className="w-3 h-3 text-gizmo-gray-950 dark:text-gray-200"
      >
        <path
          d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"
          strokeWidth="0"
        ></path>
      </svg>
    </button>
  );
}

export default function SearchInput() {
  const { streaming, socket, historySize } = useContext(ChatContext);
  const { state, dispatch } = useContext(MessageContext);
  const { connected, isLoading } = state;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  function resetHeight() {
    textAreaRef.current!.style.height = `3rem`;
  }

  // Send message
  function sendMessage() {
    handleMessageDispatch(dispatch, textSignal.value, streaming);
    sendWSMessage(textSignal.value, socket.current);
    textSignal.value = '';
  }

  // Send message on enter
  function sendEnterMessage(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      !e.shiftKey &&
      e.key === 'Enter' &&
      textSignal.value.trim().length > 0
    ) {
      sendMessage();
      resetHeight();
    } else {
      const el = e.target as HTMLTextAreaElement;
      if (textSignal.value.includes('\n')) {
        textAreaRef.current!.style.height = `auto`;
        textAreaRef.current!.style.height = `${el.scrollHeight}px`;
      } else {
        resetHeight();
      }
    }
  }

  // Handle the send icon.
  const disabled = isLoading || !textSignal.value || !connected;

  return (
    <div className="sticky bottom-0 flex w-full gap-2 mt-4 bg-white chat-input rounded-tr-3xl rounded-tl-3xl">
      <div className="relative w-full mr-4">
        <textarea
          aria-invalid="false"
          autoComplete="false"
          id="chat-input"
          placeholder="Type your message here and press ENTER..."
          value={textSignal.value}
          onChange={(e) => (textSignal.value = e.target.value)}
          onKeyUp={sendEnterMessage}
          disabled={isLoading || !connected}
          className="block w-full h-12 px-2 py-2 m-3 overflow-hidden text-sm text-gray-900 rounded-lg resize-none md:py-3 max-h-44 outline outline-offset-2 outline-1 focus:outline-offset-2 focus:outline-2 outline-gray-400"
          ref={textAreaRef}
        ></textarea>
        {/* Stop streaming */}
        {isLoading && <StopStreaming />}
      </div>

      {/* Send button */}
      <button
        className={`flex-none mr-2 my-auto rounded-full hover:transform hover:bg-scale-100 hover:duration-200 ${
          disabled ? 'bg-gray-500' : 'bg-[#339ddf]'
        }`}
        disabled={disabled}
        onClick={sendMessage}
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_7_30)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.702 14.2698L26.6685 12.8579C27.669 12.7567 28.5044 12.6723 29.1571 12.6651C29.7923 12.6581 30.5284 12.7119 31.143 13.1216C31.9532 13.6619 32.4652 14.5488 32.528 15.5206C32.5756 16.2577 32.2541 16.9221 31.9304 17.4687C31.5979 18.0303 31.107 18.7116 30.5192 19.5275L22.3273 30.8973C21.7244 31.7341 21.2223 32.431 20.7865 32.9343C20.3645 33.4217 19.8271 33.9476 19.102 34.1338C18.15 34.3784 17.1384 34.1607 16.3712 33.5464C15.7868 33.0784 15.5132 32.3781 15.3289 31.7602C15.1386 31.1223 14.9676 30.2807 14.7621 29.27L13.9618 25.3331C13.8784 24.9228 13.8643 24.8804 13.8518 24.8503C13.8398 24.8214 13.8257 24.7935 13.8095 24.7667C13.7979 24.7476 13.7854 24.7291 13.7718 24.7113C13.752 24.6853 13.7224 24.6519 13.4096 24.3738L10.3208 21.6277C9.55245 20.9446 8.91237 20.3756 8.45745 19.8918C8.01659 19.423 7.5496 18.836 7.43803 18.097C7.29147 17.1262 7.60968 16.1429 8.29723 15.4421C8.82062 14.9085 9.54302 14.7064 10.175 14.5848C10.827 14.4593 11.6792 14.3732 12.702 14.2698ZM16.3817 24.6868L22.0836 21.3948C22.6815 21.0496 22.8863 20.2852 22.5411 19.6873C22.1959 19.0894 21.4315 18.8846 20.8336 19.2297L15.1059 22.5366C15.0941 22.5262 15.0824 22.5158 15.0707 22.5054L12.0276 19.8C11.2018 19.0658 10.6473 18.5712 10.2787 18.1792C9.97934 17.8609 9.91618 17.7232 9.90765 17.7065C9.88526 17.5238 9.94461 17.3404 10.0698 17.2054C10.0865 17.1969 10.2184 17.1223 10.6474 17.0397C11.1759 16.938 11.9149 16.8621 13.0143 16.751L26.8592 15.3515C27.9362 15.2425 28.6583 15.1707 29.1845 15.165C29.6109 15.1602 29.7517 15.2058 29.7695 15.211C29.9194 15.3166 30.0153 15.4827 30.032 15.6653C30.0274 15.6833 29.9965 15.8281 29.7792 16.195C29.5111 16.6478 29.0879 17.2373 28.455 18.1155L20.3346 29.3863C19.6868 30.2856 19.25 30.8896 18.8966 31.2978C18.6096 31.6292 18.4787 31.7064 18.4629 31.7166C18.2833 31.7574 18.0947 31.7169 17.9477 31.6057C17.9376 31.59 17.8499 31.4658 17.7246 31.0456C17.5703 30.5282 17.4206 29.7981 17.1998 28.712L16.4117 24.835C16.407 24.8121 16.4024 24.7892 16.3978 24.7663C16.3924 24.7398 16.3871 24.7133 16.3817 24.6868Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_7_30">
              <rect
                width="30"
                height="30"
                fill="white"
                transform="translate(0.509613 15.5096) rotate(-30)"
              />
            </clipPath>
          </defs>
        </svg>
      </button>

      {/* Clear button */}
      {historySize && historySize > 0 ? (
        <>
          <ClearButton />
          <ReportDownload />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
