import { ConfigState, QuizMode, Topic } from '../lib/model.ts';
import { createContext, useReducer } from 'react';
import { Props } from './commonModel.ts';

export type ConfigAction =
  | { type: 'initConfig'; data: { topics: string[]; quizz_modes: QuizMode[] } }
  | { type: 'resetTopics' }
  | { type: 'switchTopic'; data: Topic }
  | { type: 'selectQuizzMode'; data: QuizMode }
  | { type: 'savingQuizConfiguration' }
  | { type: 'saveQuizConfigurationOk' }
  | { type: 'saveQuizConfigurationError'; data: string }
  | { type: 'finishConfig' };

interface ConfigContextProps {
  state: ConfigState;
  dispatch: React.Dispatch<ConfigAction>;
}

function resetQuizzModes(quizzModes: QuizMode[]) {
  return quizzModes.map((quizzMode: QuizMode) => {
    return { ...quizzMode, enabled: quizzMode.name === 'Medium' };
  });
}

const DEFAULT_TOPIC_STATE = false

function configReducer(state: ConfigState, action: ConfigAction): ConfigState {
  switch (action.type) {
    case 'initConfig':
      return {
        ...state,
        initConfig: true,
        topics: action.data?.topics.map((topic: string) => ({
          name: topic,
          checked: DEFAULT_TOPIC_STATE,
        })),
        quizzModes: resetQuizzModes(action.data?.quizz_modes),
      };
    case 'finishConfig':
      return {
        ...state,
        initConfig: false,
        startSession: true,
        topics: [],
        quizzModes: [],
      };
    case 'switchTopic':
      return {
        ...state,
        topics: state.topics.map((topic: Topic) => {
          if (topic.name === action.data.name) {
            return { name: topic.name, checked: !topic.checked };
          }
          return topic;
        }),
      };
    case 'resetTopics': {
      const newStatus = !state.topics.some(t => t.checked)
      return {
        ...state,
        topics: state.topics.map((topic: Topic) => {
          return {name: topic.name, checked: newStatus};
        }),
        quizzModes: resetQuizzModes(state.quizzModes),
      };
    }
    case 'selectQuizzMode':
      return {
        ...state,
        quizzModes: state.quizzModes.map((quizzMode: QuizMode) => {
          return { ...quizzMode, enabled: quizzMode.name === action.data.name };
        }),
      };
    case 'savingQuizConfiguration':
      return {
        ...state,
        savePending: true,
      };
    case 'saveQuizConfigurationOk':
      return {
        ...state,
        sucessMessage: 'Quiz configuration saved successfully!',
        errorMessage: undefined,
        savePending: false,
      };
    case 'saveQuizConfigurationError':
      return {
        ...state,
        sucessMessage: undefined,
        errorMessage: action.data,
        savePending: false,
      };
    default:
      return state;
  }
}

export const ConfigContext = createContext<ConfigContextProps>({
  state: {
    initConfig: false,
    topics: [],
    quizzModes: [],
    savePending: false,
  },
  dispatch: () => null,
});

export const ConfigContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(configReducer, {
    topics: [],
    initConfig: false,
    quizzModes: [],
    savePending: false,
  });

  return (
    <ConfigContext.Provider value={{ state, dispatch }}>
      {children}
    </ConfigContext.Provider>
  );
};
