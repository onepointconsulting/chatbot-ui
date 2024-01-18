import {signal} from '@preact/signals-react';
import {FaCcDiscover, FaMinus} from 'react-icons/fa';
import useProgressIndicator from "../hooks/useProgressIndicator.ts";
import LightboxProgressSlider from "./LightboxProgressSlider.tsx";

export const showProgressChart = signal(true);

export const showLightBox = signal(false);

/**
 * Displays a chart representing the progress of the user.
 * @constructor
 */
export default function ProgressSection() {
  const {data, session, progressImages} = useProgressIndicator();
  if (!session || data.length < 2) {
    return <> </>;
  }
  return (
    <div className="flex flex-row items-start h-full bg-white">
      <div>
        {showProgressChart.value && (
          <img
            src={progressImages[0].url}
            className="w-full h-auto opacity-75 cursor-pointer"
            alt="Progress Indicator"
            onClick={() => {
              showLightBox.value = true
            }}
          />
        )}
        {showLightBox.value && <LightboxProgressSlider /> }
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
