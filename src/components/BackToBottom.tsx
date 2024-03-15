import { scrollToBottom } from './MainChat.tsx';
import { useEffect } from 'react';
import { signal } from '@preact/signals-react';

const chatAtBottom = signal(false);

const CORRECTION = 50;

// Back to bottom button
export default function BackToBottom() {
  // Handle the back to bottom button with smooth scrolling

  // Handle the scroll to the bottom button.
  useEffect(() => {
    const feedContainer = document.querySelector('.chat-container') as HTMLElement;

    const handleScroll = () => {
      if (!!feedContainer) {
        const isAtBottom =
          feedContainer.scrollHeight - feedContainer.scrollTop <=
          feedContainer.clientHeight + CORRECTION;
        console.log('feedContainer.scrollHeight', feedContainer.scrollHeight);
        console.log('feedContainer.scrollTop', feedContainer.scrollTop);
        console.log('feedContainer.clientHeight', feedContainer.clientHeight);
        console.log(
          'feedContainer.scrollHeight - feedContainer.scrollTop',
          feedContainer.scrollHeight - feedContainer.scrollTop,
        );
        chatAtBottom.value = isAtBottom;
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
    <div className="relative">
      {!chatAtBottom.value && (
        <button
          className="absolute left-1/2 bottom-[4rem] z-10 hover:scale-105 hover:duration-200 transform text-gray-600 border rounded-full cursor-pointer border-black/10 bg-blue-400"
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
      )}
    </div>
  );
}
