import { useContext, useEffect } from 'react';
import Switcher from '../forms/Switcher.tsx';
import { Topic } from '../../lib/model.ts';
import { ConfigContext } from '../../context/InitialConfigurationContext.tsx';
import { WEBSOCKET_COMMAND } from '../../lib/websocketClient.ts';
import { Socket } from 'socket.io-client';
import QuizzModeButtons from '../forms/QuizzModeButtons.tsx';

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

export default function TopicChoiceDialog({
  socket,
}: {
  socket: React.MutableRefObject<Socket | null>;
}) {
  const { dispatch, state } = useContext(ConfigContext);
  const { selectTopics, topics } = state;

  useEffect(() => {
    socket?.current?.on(WEBSOCKET_COMMAND.QUIZZ_CONFIGURATION, onSelectTopics);
    return () => {
      socket.current?.off(
        WEBSOCKET_COMMAND.QUIZZ_CONFIGURATION,
        onSelectTopics,
      );
    };
  }, [socket.current]);

  useEffect(() => {
    if (selectTopics) {
      showTopicChoiceDialog();
    }
  }, [selectTopics]);

  function onReset() {
    dispatch({ type: 'resetTopics' });
  }

  function onOk() {
    // onReset();
    console.log(topics);
  }

  function onSelectTopics(configData: string) {
    if (!configData) return;
    const data = JSON.parse(configData);
    data.quizz_modes = data.quizz_modes.map((e: any) => ({
      name: e.name,
      questionCount: e.question_count,
    }));
    dispatch({ type: 'initConfig', data });
  }

  return (
    <dialog id={TOPIC_CHOICE_ID} className="chatbot-dialog">
      <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-white border border-gray-300 rounded shadow-lg">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="mb-2 text-xl font-bold">
            Select Topics and Quizz Type
          </h1>
          <p className="mb-4 text-sm text-center">
            Select the topics you want to be assessed on.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <ul className="w-10/12 md:w-9/12">
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
          <p className="text-sm text-center">Select the your quizz type.</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-4">
          <QuizzModeButtons />
        </div>
        <div className="flex justify-between mt-4 w-full">
          <button className="button-cancel" onClick={onReset}>
            Reset
          </button>
          <button className="button-ok" onClick={onOk}>
            OK
          </button>
        </div>
      </div>
    </dialog>
  );
}
