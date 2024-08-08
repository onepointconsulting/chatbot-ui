import {ConfigState, QuizMode, Topic} from '../lib/model.ts';
import {createContext, useEffect, useReducer} from 'react';
import {Props} from './commonModel.ts';

export type ConfigAction =
  | { type: 'initConfig'; data: { topics: string[]; quizz_modes: QuizMode[] } }
  | { type: 'resetTopics' }
  | { type: 'switchTopic'; data: Topic }
  | { type: 'selectQuizzMode'; data: QuizMode }
  | { type: 'savingQuizConfiguration' }
  | { type: 'saveQuizConfigurationOk' }
  | { type: 'saveQuizConfigurationError'; data: string }
  | { type: 'finishConfig' }
  | { type: 'selectAllTopics' }
  | { type: 'deSelectAllTopics' };

interface ConfigContextProps {
  state: ConfigState;
  dispatch: React.Dispatch<ConfigAction>;
}

function resetQuizzModes(quizzModes: QuizMode[]) {
  return quizzModes.map((quizzMode: QuizMode) => {
    return {...quizzMode, enabled: quizzMode.name === 'Medium'};
  });
}

const DEFAULT_TOPIC_STATE = false;

function getQuestionCount(newQuizzModes: QuizMode[]) {
  return (
    newQuizzModes.find((quizzMode: QuizMode) => quizzMode.enabled)
      ?.questionCount || 0
  );
}

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
        questionCount: getQuestionCount(action.data?.quizz_modes),
      };
    case 'finishConfig':
      return {
        ...state,
        initConfig: false,
        startSession: true,
        topics: [],
        quizzModes: [],
      };
    case 'switchTopic': {
      const newTopics = state.topics.map((topic: Topic) => {
        if (topic.name === action.data.name) {
          return {name: topic.name, checked: !topic.checked};
        }
        return topic;
      });
      return {
        ...state,
        topics: newTopics,
        selectAllTopics: newTopics.every((topic: Topic) => topic.checked),
      };
    }
    case 'selectAllTopics':
      return {
        ...state,
        topics: state.topics.map((topic: Topic) => {
          return {name: topic.name, checked: true};
        }),
        selectAllTopics: true,
      };
    case 'deSelectAllTopics':
      return {
        ...state,
        topics: state.topics.map((topic: Topic) => {
          return {name: topic.name, checked: false};
        }),
        selectAllTopics: false,
      };
    case 'resetTopics': {
      const newStatus = !state.topics.some((t) => t.checked);
      return {
        ...state,
        topics: state.topics.map((topic: Topic) => {
          return {name: topic.name, checked: newStatus};
        }),
        quizzModes: resetQuizzModes(state.quizzModes),
      };
    }
    case 'selectQuizzMode': {
      const newQuizzModes = state.quizzModes.map((quizzMode: QuizMode) => {
        return {...quizzMode, enabled: quizzMode.name === action.data.name};
      });
      return {
        ...state,
        quizzModes: newQuizzModes,
        questionCount: getQuestionCount(newQuizzModes),
      };
    }
    case 'savingQuizConfiguration':
      return {
        ...state,
        savePending: true,
      };
    case 'saveQuizConfigurationOk':
      return {
        ...state,
        successMessage: 'Quiz configuration saved successfully!',
        errorMessage: undefined,
        savePending: false,
      };
    case 'saveQuizConfigurationError':
      return {
        ...state,
        successMessage: undefined,
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
    selectAllTopics: false,
    questionCount: 0,
  },
  dispatch: () => null,
});

export const ConfigContextProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(configReducer, {
    topics: [],
    initConfig: false,
    quizzModes: [],
    savePending: false,
    selectAllTopics: false,
    questionCount: 0,
  });

  useEffect(() => {
    if (state.questionCount === 0) {
      for (const quizMode of state.quizzModes) {
        if (quizMode.enabled) {
          dispatch({type: 'selectQuizzMode', data: quizMode});
          break;
        }
      }
    }
  }, [state.quizzModes, state.questionCount]);

  return (
    <ConfigContext.Provider value={{state, dispatch}}>
      {children}
    </ConfigContext.Provider>
  );
};
