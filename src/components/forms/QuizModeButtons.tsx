import { useContext, useEffect } from 'react';
import { ConfigContext } from '../../context/ConfigContext.tsx';
import { QuizMode } from '../../lib/model.ts';
import { useSignal } from '@preact/signals-react';

export default function QuizModeButtons() {
  const questionCount = useSignal(0);
  const { dispatch, state } = useContext(ConfigContext);
  const { quizzModes, topics } = state;

  useEffect(() => {
    for (const quizzMode of quizzModes) {
      if (quizzMode.enabled) {
        questionCount.value = quizzMode.questionCount;
        break;
      }
    }
  }, [quizzModes]);

  function onSelectQuizMode(quizzMode: QuizMode) {
    dispatch({ type: 'selectQuizzMode', data: quizzMode });
  }

  function getTotalQuestions() {
    return topics
      ? topics.reduce((total, topic) => {
          if (topic.checked) {
            return total + questionCount.value;
          }
          return total;
        }, 0)
      : 0;
  }

  return (
    <>
      <div className="inline-flex">
        {quizzModes.map((quizMode, index) => {
          return (
            <a
              key={`${index}_${quizMode.name}`}
              href="#"
              onClick={() => onSelectQuizMode(quizMode)}
              className={`${
                quizMode.enabled
                  ? 'border-primary bg-primary text-white'
                  : 'text-dark dark:text-white'
              } hover:border-primary 
              hover:bg-primary inline-flex items-center justify-center ${
                index == 0
                  ? 'rounded-l-full'
                  : index == quizzModes.length - 1
                    ? 'rounded-r-full'
                    : ''
              } 
              border py-[11px] px-[12px] text-center text-base font-medium transition-all sm:px-6`}
            >
              {quizMode.name}
            </a>
          );
        })}
      </div>
      <div className="flex flex-col items-center mt-4">
        <span className="text-sm text-gray-500">
          {questionCount.value} questions per selected topic, a total of{' '}
          {getTotalQuestions()} questions.
        </span>
      </div>
    </>
  );
}
