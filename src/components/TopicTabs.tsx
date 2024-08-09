import { MessageContext } from '../context/MessageContext.tsx';
import { useContext } from 'react';

export default function TopicTabs() {
  const { state, dispatch } = useContext(MessageContext);
  const { topics, currentTopic } = state;

  return (
    <section className="flex flex-row">
      {topics.map((topic, index) => (
        <div
          key={`topic_tab_${index}`}
          className={`px-4 cursor-pointer ${
            currentTopic === topic
              ? 'font-bold border-b-4 border-b-[#3982d1]'
              : ''
          }`}
          onClick={() => dispatch({ type: 'setCurrentTopic', topic })}
        >
          {topic}
        </div>
      ))}
    </section>
  );
}
