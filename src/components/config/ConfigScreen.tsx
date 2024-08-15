import { useContext, useEffect } from 'react';
import { ConfigContext } from '../../context/ConfigContext.tsx';
import { Topic } from '../../lib/model.ts';
import { getSession } from '../../lib/sessionFunctions.ts';
import { sendQuizConfiguration } from '../../lib/websocketClient.ts';
import { ChatContext } from '../../context/ChatContext.tsx';

const GRID_COL_CLASS = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4';

const BASE_MESSAGE_CSS = 'col-span-4 text-xl p-5 mb-8 border';

const DARK_TEXT_COLOR = "dark:text-gray-100"

function getTotalQuestions(topics: Topic[], questionCount: number): number {
  return topics
    ? topics.reduce((total, topic) => {
        if (topic.checked) {
          return total + questionCount;
        }
        return total;
      }, 0)
    : 0;
}

function countTopics(topics: Topic[]): number {
  return topics.reduce((total, topic) => {
    if (topic.checked) {
      return total + 1;
    }
    return total;
  }, 0);
}

function ToggleButton({
  name,
  checked,
  onClick,
}: {
  name: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`block text-center border border-[black] dark:border-gray-100 py-5 text-xl font-bold cursor-pointer hover:text-[#0084d7] ${DARK_TEXT_COLOR} ${
        checked ? 'bg-sky-200 dark:bg-gray-400' : ''
      }`}
      onClick={onClick}
    >
      {name}
    </div>
  );
}

function MessageDisplay({
  savePending,
  successMessage,
  errorMessage,
}: {
  savePending: boolean;
  successMessage: string | undefined;
  errorMessage: string | undefined;
}) {
  if (!savePending && !successMessage && !errorMessage) {
    return null;
  }

  function chooseColor(): string {
    if (savePending) {
      return 'yellow';
    } else if (successMessage) {
      return 'green';
    } else if (errorMessage) {
      return 'red';
    }
    return 'black';
  }

  return (
    <section className={GRID_COL_CLASS}>
      <div
        className={`${BASE_MESSAGE_CSS} border-[${chooseColor()}] text-${chooseColor()}-600 dark:text-gray-100`}
      >
        {savePending && <span>Saving configuration ...</span>}
        {successMessage && <span>{successMessage}</span>}
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    </section>
  );
}

const MIN_TOPICS = 3;
export default function ConfigScreen() {
  const { socket } = useContext(ChatContext);
  const { dispatch, state } = useContext(ConfigContext);
  const {
    topics,
    selectAllTopics,
    quizzModes,
    questionCount,
    successMessage,
    errorMessage,
    savePending,
  } = state;

  useEffect(() => {
    if (!!successMessage && successMessage.length > 0 && !savePending) {
      setTimeout(() => {
        dispatch({ type: 'finishConfig' });
      }, 2000);
    }
  }, [successMessage]);

  function saveConfiguration() {
    const session = getSession();
    if (session) {
      dispatch({ type: 'savingQuizConfiguration' });
      const saveConfigurationMessage = {
        session_id: session.id,
        topic_list: topics
          .filter((topic: Topic) => topic.checked)
          .map((topic: Topic) => topic.name),
        quiz_mode_name: quizzModes.filter((quizzMode) => quizzMode.enabled)[0]
          .name,
      };
      console.log(saveConfigurationMessage);
      const message = JSON.stringify(saveConfigurationMessage);
      sendQuizConfiguration(socket.current, message);
    } else {
      console.error('No session found');
    }
  }

  return (
    <section className="max-w-[1280px] max-h-[100vh] overflow-auto mx-auto w-full px-6 pt-8">
      <h1 className={`text-2xl lg:text-3xl py-3 ${DARK_TEXT_COLOR}`}>Select Topics and Depth</h1>
      <section className={`flex flex-row justify-between items-center text-xl pt-3 lg-pt-4 pb-6 ${DARK_TEXT_COLOR}`}>
        <div>Select the topics you want to be assessed on.</div>
        <div>
          {!selectAllTopics && (
            <a
              className={`underline ${DARK_TEXT_COLOR}`}
              href="#"
              onClick={() => dispatch({ type: 'selectAllTopics' })}
            >
              Select all topics
            </a>
          )}
          {selectAllTopics && (
            <a
              className={`underline ${DARK_TEXT_COLOR}`}
              href="#"
              onClick={() => dispatch({ type: 'deSelectAllTopics' })}
            >
              De-select all topics
            </a>
          )}
        </div>
      </section>
      <section className={GRID_COL_CLASS}>
        {topics.map((topic: Topic, index) => (
          <ToggleButton
            key={`topic_${index}`}
            checked={topic.checked}
            name={topic.name}
            onClick={() => dispatch({ type: 'switchTopic', data: topic })}
          />
        ))}
      </section>
      <section className={`block text-xl pt-8 lg-pt-4 pb-6 ${DARK_TEXT_COLOR}`}>
        <div>Select depth of your assessment.</div>
      </section>
      <section className={GRID_COL_CLASS}>
        {quizzModes.map((quizMode, index) => (
          <ToggleButton
            key={`topic_${index}`}
            checked={quizMode.enabled ?? false}
            name={quizMode.name}
            onClick={() =>
              dispatch({ type: 'selectQuizzMode', data: quizMode })
            }
          />
        ))}
      </section>
      <section className={`block text-xl pt-8 lg-pt-4 pb-6 ${DARK_TEXT_COLOR}`}>
        {questionCount} questions per selected topic, a total of{' '}
        {getTotalQuestions(topics, questionCount)} questions.
      </section>
      <MessageDisplay
        savePending={savePending}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      <section className={`${GRID_COL_CLASS} mb-4`}>
        <div className="col-span-3" />
        <button
          className="border border-[#3982d1] p-5 text-xl text-[#275c90] font-bold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed
            dark:bg-gray-200 dark:hover:bg-gray-50"
          onClick={saveConfiguration}
          disabled={countTopics(topics) < MIN_TOPICS}
        >
          Save configuration
        </button>
      </section>
    </section>
  );
}
