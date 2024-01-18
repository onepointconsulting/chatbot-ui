import { useContext, useEffect } from 'react';
import Switcher from '../forms/Switcher.tsx';
import { Topic } from '../../lib/model.ts';
import { ConfigContext } from '../../context/ConfigContext.tsx';
import QuizModeButtons from '../forms/QuizModeButtons.tsx';
import { getSession } from '../../lib/sessionFunctions.ts';
import { sendQuizConfiguration } from '../../lib/websocketClient.ts';
import { ChatContext } from '../../context/ChatContext.tsx';
import Spinner from '../Spinner.tsx';
import DialogMessage from './DialogMessage.tsx';

export const TOPIC_CHOICE_ID = 'topic-choice-dialog';

function dialogAction(actionFunction: (dialog: any) => void) {
  const myDialog: any | null = document.getElementById(TOPIC_CHOICE_ID);
  if (myDialog) {
    actionFunction(myDialog);
  }
}

export function showTopicChoiceDialog() {
  dialogAction((dialog: any) => dialog.showModal());
}

export function ConfigPanel() {
  const { socket } = useContext(ChatContext);

  const { dispatch, state } = useContext(ConfigContext);

  const { topics, quizzModes } = state;

  function onReset() {
    dispatch({ type: 'resetTopics' });
  }

  function onOk() {
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
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-white border border-gray-300 rounded shadow-lg">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="mb-2 text-xl font-bold">Select Topics and Depth</h1>
        <p className="mb-4 text-sm text-center">
          Select the topics you want to be assessed on.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <ul className="w-10/12 lg:9/12 xl:8/12">
          {topics.map((topic: Topic) => (
            <li
              key={topic.name}
              className="inline-block w-full md:w-1/2 lg:w-1/3"
            >
              <Switcher topic={topic} />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-center justify-center w-full mt-6">
        <p className="text-sm text-center">
          Select the depth of your assessment.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <QuizModeButtons />
      </div>
      <div className="flex justify-between mt-4 w-full">
        <button className="button-cancel" onClick={onReset}>
          Reset
        </button>
        <button className="button-ok" onClick={onOk}>
          Save configuration
        </button>
      </div>
    </div>
  );
}

export default function ConfigDialog({}) {
  const { dispatch, state } = useContext(ConfigContext);
  const { initConfig, savePending, sucessMessage, errorMessage } = state;

  function preventClose(e: KeyboardEvent) {
    if (e.code === 'Escape') {
      e.preventDefault();
    }
  }

  useEffect(() => {
    if (initConfig) {
      showTopicChoiceDialog();
    }
    document.addEventListener('keydown', preventClose);
    return () => {
      document.removeEventListener('keydown', preventClose);
    };
  }, [initConfig]);

  function startQuiz() {
    dispatch({ type: 'finishConfig' });
  }

  return (
    <dialog id={TOPIC_CHOICE_ID} className="chatbot-dialog">
      <DialogMessage message={sucessMessage} isError={false} />
      <DialogMessage message={errorMessage} isError={true} />
      {savePending && <Spinner />}
      {!savePending && !sucessMessage && <ConfigPanel />}
      {sucessMessage && (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-white border border-gray-300 rounded shadow-lg">
          <button className="button-ok" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      )}
    </dialog>
  );
}
