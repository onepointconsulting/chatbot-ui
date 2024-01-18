import useProgressIndicator from '../hooks/useProgressIndicator.ts';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';
import { showLightBox } from './ProgressSection.tsx';

export default function LightboxProgressSlider() {
  const { progressImages } = useProgressIndicator();
  return (
    <Lightbox
      images={progressImages}
      title="Progress Indicator"
      onClose={() => (showLightBox.value = false)}
    />
  );
}
