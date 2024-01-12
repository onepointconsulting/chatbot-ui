import {ConfigState, Topic} from "../lib/model.ts";
import {createContext, useReducer} from "react";
import {Props} from "./commonModel.ts";

export type ConfigAction =
  | { type: 'selectTopics', data: string[] }
  | { type: 'resetTopics' }
  | { type: 'switchTopic', data: Topic };

interface ConfigContextProps {
  state: ConfigState;
  dispatch: React.Dispatch<ConfigAction>;
}

function configReducer(state: ConfigState, action: ConfigAction): ConfigState {
  switch (action.type) {
    case 'selectTopics':
      return {
        ...state,
        selectTopics: true,
        topics: action.data?.map((topic: string) => ({name: topic, checked: true}))
      };
    case 'switchTopic':
      return {
        ...state,
        topics: state.topics.map((topic: Topic) => {
          if (topic.name === action.data.name) {
            return {name: topic.name, checked: !topic.checked};
          }
          return topic;
        })
      }
    case 'resetTopics':
      return {
        ...state,
        topics: state.topics.map((topic: Topic) => {
          return {name: topic.name, checked: true};
        })
      }
    default:
      return state;
  }
}

export const ConfigContext = createContext<ConfigContextProps>({
  state: {selectTopics: false, topics: []},
  dispatch: () => null,
});

export const ConfigContextProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(configReducer, {
    topics: [],
    selectTopics: false,
  });

  return (
    <ConfigContext.Provider value={{state, dispatch}}>
      {children}
    </ConfigContext.Provider>
  );
};