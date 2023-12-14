import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Props } from './context/commonModel.ts';

const TYPE_OF_LAYOUT = {
  RIGHT_CORNER: 'right_corner',
};

//create components using React.lazy
const LayoutRightCorner = React.lazy(
  () => import('./layout/LayoutRightCorner.tsx'),
);

//create a parent component that will load the components conditionally using React.Suspense
const LayoutSelector = ({ children }: Props) => {
  const CHOSEN_LAYOUT = window.chatConfig.layout;
  return (
    <>
      <React.Suspense fallback={<></>}>
        {CHOSEN_LAYOUT === TYPE_OF_LAYOUT.RIGHT_CORNER && <LayoutRightCorner />}
      </React.Suspense>
      {children}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LayoutSelector>
      <App />
    </LayoutSelector>
  </React.StrictMode>,
);
