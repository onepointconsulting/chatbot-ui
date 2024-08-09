import { signal } from '@preact/signals-react';
import { FaMinus, FaChartPie } from 'react-icons/fa';
import useProgressIndicator from '../hooks/useProgressIndicator.ts';
import LightboxProgressSlider from './LightboxProgressSlider.tsx';

export const showProgressChart = signal(true);

export const showLightBox = signal(false);

const SHOW_THRESHOLD = 3;

/**
 * Displays a chart representing the progress of the user.
 * @constructor
 */
export default function ProgressSection() {
  const { data, session, progressImages } = useProgressIndicator();
  if (!session || data.length < SHOW_THRESHOLD) {
    return <div className="flex flex-row items-center bg-white"></div>;
  }
  return (
    <div className="relative flex flex-row items-center lg:mr-4">
      <div>
        {showProgressChart.value && (
          <img
            src={progressImages[0].url}
            className="w-full h-auto opacity-75 cursor-pointer p-4 border border-[#d9d9d9] bg-white"
            alt="Progress Indicator"
            onClick={() => {
              showLightBox.value = true;
            }}
          />
        )}
        {showLightBox.value && <LightboxProgressSlider />}
        <button
          onClick={() => (showProgressChart.value = !showProgressChart.value)}
        >
          {showProgressChart.value && (
            <FaMinus
              className="absolute top-0 text-[#4a4a4a] right-3 m-3 cursor-pointer"
              size={20}
              title="Hide progress"
            />
          )}

          {/* Show progress bar when the progress char is hidden. */}
          {!showProgressChart.value && (
            <FaChartPie
              className="text-[#4a4a4a] m-4 cursor-pointer mt-12"
              size={30}
              title="Show progress"
            />
          )}
        </button>
      </div>
    </div>
  );
}
