import { ChatContext } from '../context/ChatContext.tsx';
import { useContext } from 'react';
import { getSession } from '../lib/sessionFunctions.ts';
import { MessageContext } from '../context/MessageContext.tsx';
import { signal } from '@preact/signals-react';
import { FaCcDiscover, FaMinus } from 'react-icons/fa';

export const showProgressChart = signal(true);

/**
 * Displays a chart representing the progress of the user.
 * @constructor
 */
export default function ProgressIframe() {
  const { chartProgressUrl } = useContext(ChatContext);
  const { state } = useContext(MessageContext);
  const { data } = state;
  const session = getSession();
  if (!session || data.length < 2) {
    return <> </>;
  }
  return (
    <div className="flex flex-row items-start h-full bg-white">
      <div className="">
        {showProgressChart.value && (
          <img
            src={`${chartProgressUrl}/${session.id}?count=${data.length}`}
            className="w-full h-auto opacity-75"
            alt="Progress Indicator"
          />
        )}
        <button
          onClick={() => (showProgressChart.value = !showProgressChart.value)}
        >
          {showProgressChart.value && (
            <FaMinus
              className="absolute top-0 text-gray-500 right-0 m-2 cursor-pointer"
              size={20}
              title="Hide progress"
            />
          )}
          {!showProgressChart.value && (
            <FaCcDiscover
              className="absolute text-white top-0 right-0 m-2 cursor-pointer mt-8"
              size={20}
              title="Show progress"
            />
          )}
        </button>
      </div>
    </div>
  );
}
