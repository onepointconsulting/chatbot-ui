import { MessageContext } from '../context/MessageContext.tsx';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { MutableRefObject, useRef } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

function activateRightArrow(
  scrollRef: React.MutableRefObject<HTMLUListElement | null>,
  setShowRightArrow: (
    value: ((prevState: boolean) => boolean) | boolean,
  ) => void,
) {
  return () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;

    const sumOfScrollAndClientWidth = clientWidth + scrollContainer.scrollLeft;

    setShowRightArrow(
      scrollWidth > clientWidth && sumOfScrollAndClientWidth + 5 < scrollWidth,
    );
  };
}

export default function TopicTabs() {
  const { state, dispatch } = useContext(MessageContext);
  const { topics, currentTopic } = state;
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollRef: MutableRefObject<HTMLUListElement | null> = useRef(null);

  const handleArrowScroll = (
    e: React.MouseEvent,
    direction: 'left' | 'right',
  ): void => {
    e.preventDefault();
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle arrow visibility
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const handleScroll = () => {
        const scrollLeft = scrollContainer.scrollLeft;
        const scrollWidth = scrollContainer.scrollWidth;
        const clientWidth = scrollContainer.clientWidth;
        const sumOfScrollAndClientWidth = clientWidth + scrollLeft;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(
          scrollWidth > clientWidth &&
            sumOfScrollAndClientWidth + 5 < scrollWidth,
        );
      };

      scrollContainer.addEventListener('scroll', handleScroll);

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(activateRightArrow(scrollRef, setShowRightArrow));

  useLayoutEffect(() => {
    function processRightArrow() {
      activateRightArrow(scrollRef, setShowRightArrow)();
    }
    window.addEventListener('resize', processRightArrow);
    processRightArrow();
    return () => window.removeEventListener('resize', processRightArrow);
  }, []);

  return (
    <section className={`relative flex flex-row w-full`}>
      {/* Arrow left */}
      {showLeftArrow && (
        <MdKeyboardArrowLeft
          className="absolute top-0 left-0 mt-0 ml-2 text-2xl cursor-pointer dark:text-white"
          onClick={(e) => handleArrowScroll(e, 'left')}
        />
      )}

      <ul
        ref={scrollRef}
        className={`flex px-2 mx-8 overflow-x-auto whitespace-nowrap scrollbar-hide `}
      >
        {topics.map((topic, index) => (
          <div
            key={`topic_tab_${index}`}
            className={`px-4 cursor-pointer dark:text-gray-100 ${
              currentTopic === topic
                ? 'font-bold border-b-4 border-b-[#3982d1]'
                : ''
            }`}
            onClick={() => {
              dispatch({ type: 'setCurrentTopic', topic });
              document
                .getElementsByClassName('chat-container')[0]
                .scrollTo(0, 0);
            }}
          >
            {topic}
          </div>
        ))}
      </ul>

      {/* Arrow right */}
      {showRightArrow && (
        <MdKeyboardArrowRight
          className="absolute top-0 right-0 mt-0 mr-2 text-2xl cursor-pointer dark:text-white"
          onClick={(e) => handleArrowScroll(e, 'right')}
        />
      )}
    </section>
  );
}
