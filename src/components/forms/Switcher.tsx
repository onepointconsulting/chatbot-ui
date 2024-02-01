import { Topic } from '../../lib/model.ts';
import { useContext } from 'react';
import { ConfigContext } from '../../context/ConfigContext.tsx';

export default function Switcher({ topic }: { topic: Topic }) {
  const { dispatch } = useContext(ConfigContext);
  const handleCheckboxChange = () => {
    dispatch({ type: 'switchTopic', data: topic });
  };

  return (
    <>
      <label className="autoSaverSwitch relative inline-flex cursor-pointer select-none items-center">
        <input
          type="checkbox"
          name="autoSaver"
          className="sr-only"
          checked={topic.checked}
          onChange={handleCheckboxChange}
        />
        <span
          className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${
            topic.checked ? 'bg-primary' : 'bg-[#CCCCCE]'
          }`}
        >
          <span
            className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${
              topic.checked ? 'translate-x-6' : ''
            }`}
          ></span>
        </span>
        <span className="label flex items-center text-sm font-medium text-black">
          {topic.name}
        </span>
      </label>
    </>
  );
}
