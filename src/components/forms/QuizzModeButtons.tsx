import {useContext, useEffect} from "react";
import {ConfigContext} from "../../context/InitialConfigurationContext.tsx";
import {QuizzMode} from "../../lib/model.ts";
import {useSignal} from "@preact/signals-react";


export default function QuizzModeButtons() {

  const questionCount = useSignal(0)
  const {dispatch, state} = useContext(ConfigContext);
  const {quizzModes} = state;

  useEffect(() => {
    for (const quizzMode of quizzModes) {
      if (quizzMode.enabled) {
        questionCount.value = quizzMode.questionCount
        break
      }
    }
  }, [quizzModes])

  function onSelectQuizzMode(quizzMode: QuizzMode) {
    dispatch({type: 'selectQuizzMode', data: quizzMode});
  }

  return (
    <>
      <div className='inline-flex'>
        {quizzModes.map((quizzMode, index) => {
          return (
            <a
              key={`${index}_${quizzMode.name}`}
              href='#'
              onClick={() => onSelectQuizzMode(quizzMode)}
              className={
                `${quizzMode.enabled ? 'border-primary bg-primary text-white' : 'text-dark dark:text-white'} hover:border-primary 
              hover:bg-primary inline-flex items-center justify-center ${index == 0 ? 'rounded-l-full' : index == quizzModes.length - 1 ? 'rounded-r-full' : ''} 
              border py-[11px] px-[12px] text-center text-base font-medium transition-all sm:px-6`}
            >
              {quizzMode.name}
            </a>
          )
        })}
      </div>
      <div className='flex flex-col items-center mt-4'>
        <span className='text-sm text-gray-500'>{questionCount.value} questions per selected topic</span>
      </div>
    </>
  )
}

