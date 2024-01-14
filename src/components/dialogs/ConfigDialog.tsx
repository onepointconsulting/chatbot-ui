import {useContext, useEffect} from 'react';
import Switcher from '../forms/Switcher.tsx';
import {Topic} from '../../lib/model.ts';
import {ConfigContext} from '../../context/InitialConfigurationContext.tsx';
import QuizzModeButtons from '../forms/QuizzModeButtons.tsx';
import {getSession} from '../../lib/sessionFunctions.ts';
import {sendQuizConfiguration} from '../../lib/websocketClient.ts';
import {ChatContext} from '../../context/ChatContext.tsx';
import Spinner from "../Spinner.tsx";

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

export default function ConfigDialog({}) {
  const {socket} = useContext(ChatContext);
  const {dispatch, state} = useContext(ConfigContext);
  const {selectTopics, topics, quizzModes, savePending, sucessMessage} = state;

  useEffect(() => {
    if (selectTopics) {
      showTopicChoiceDialog();
    }
  }, [selectTopics]);

  function onReset() {
    dispatch({type: 'resetTopics'});
  }

  function onOk() {
    const session = getSession();
    if (session) {
      dispatch({type: 'savingQuizConfiguration'});
      const saveConfigurationMessage = {
        session_id: session.id,
        topic_list: topics.filter((topic: Topic) => topic.checked).map((topic: Topic) => topic.name),
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
    <dialog id={TOPIC_CHOICE_ID} className="chatbot-dialog">
      {sucessMessage && <div
        className="flex flex-col items-center justify-center w-full h-full p-4 bg-white border border-gray-300 rounded shadow-lg">{sucessMessage}</div>}
      {savePending && <Spinner/>}
      {!savePending && <div
        className="flex flex-col items-center justify-center w-full h-full p-4 bg-white border border-gray-300 rounded shadow-lg">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="mb-2 text-xl font-bold">
            Select Topics and Quizz Type
          </h1>
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
                <Switcher topic={topic}/>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-6">
          <p className="text-sm text-center">Select the your quizz type.</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-4">
          <QuizzModeButtons/>
        </div>
        <div className="flex justify-between mt-4 w-full">
          <button className="button-cancel" onClick={onReset}>
            Reset
          </button>
          <button className="button-ok" onClick={onOk}>
            Save configuration
          </button>
        </div>
      </div>}
    </dialog>
  );
}
