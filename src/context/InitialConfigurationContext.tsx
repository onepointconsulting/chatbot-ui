import {ConfigState, QuizzMode, Topic} from '../lib/model.ts';
import {createContext, useReducer} from 'react';
import {Props} from './commonModel.ts';

export type ConfigAction =
  | { type: 'initConfig'; data: { topics: string[]; quizz_modes: QuizzMode[] } }
  | { type: 'resetTopics' }
  | { type: 'switchTopic'; data: Topic }
  | { type: 'selectQuizzMode'; data: QuizzMode }
  | { type: 'savingQuizConfiguration' }
  | { type: 'saveQuizConfigurationOk' };

interface ConfigContextProps {
  state: ConfigState;
  dispatch: React.Dispatch<ConfigAction>;
}

function configReducer(state: ConfigState, action: ConfigAction): ConfigState {
  switch (action.type) {
    case 'initConfig':
      return {
        ...state,
        selectTopics: true,
        topics: action.data?.topics.map((topic: string) => ({
          name: topic,
          checked: true,
        })),
        quizzModes: action.data?.quizz_modes.map((quizzMode: QuizzMode) => {
          if (quizzMode.name === 'Medium') {
            return {...quizzMode, enabled: true};
          }
          return quizzMode;
        }),
      };
    case 'switchTopic':
      return {
        ...state,
        topics: state.topics.map((topic: Topic) => {
          if (topic.name === action.data.name) {
            return {name: topic.name, checked: !topic.checked};
          }
          return topic;
        }),
      };
    case 'resetTopics':
      return {
        ...state,
        topics: state.topics.map((topic: Topic) => {
          return {name: topic.name, checked: true};
        }),
      };
    case 'selectQuizzMode':
      return {
        ...state,
        quizzModes: state.quizzModes.map((quizzMode: QuizzMode) => {
          return {...quizzMode, enabled: quizzMode.name === action.data.name};
        }),
      };
    case 'savingQuizConfiguration':
      return {
        ...state,
        savePending: true,
      }
    case 'saveQuizConfigurationOk':
      return {
        ...state,
        sucessMessage: 'Quiz configuration saved successfully',
        savePending: false,
      }
    default:
      return state;
  }
}

export const ConfigContext = createContext<ConfigContextProps>({
  state: {selectTopics: false, topics: [], quizzModes: [], savePending: false},
  dispatch: () => null,
});

export const ConfigContextProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(configReducer, {
    topics: [],
    selectTopics: false,
    quizzModes: [],
    savePending: false
  });

  return (
    <ConfigContext.Provider value={{state, dispatch}}>
      {children}
    </ConfigContext.Provider>
  );
};
