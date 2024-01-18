import useProgressIndicator from '../hooks/useProgressIndicator.ts';
import LightboxProgressSlider from './LightboxProgressSlider.tsx';
import { showLightBox } from './ProgressSection.tsx';

export default function MobileProgress() {
  const { session, progressImages } = useProgressIndicator();
  return (
    <div className="block md:hidden absolute right-0">
      {session && (
        <img
          src={progressImages[0].url}
          className="w-16 h-auto opacity-75 cursor-pointer"
          alt="Progress Indicator"
          onClick={() => (showLightBox.value = true)}
        />
      )}
      {showLightBox.value && <LightboxProgressSlider />}
    </div>
  );
}
