import useProgressIndicator from '../hooks/useProgressIndicator.ts';
import LightboxProgressSlider from './LightboxProgressSlider.tsx';
import { showLightBox } from './ProgressSection.tsx';

export default function MobileProgress() {
  const { session, progressImages } = useProgressIndicator();
  return (
    <div className="absolute right-0 block top-16 md:hidden">
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
