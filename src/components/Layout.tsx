import Header from './header/Header.tsx';
import { useContext, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext.tsx';
import SideMenu from './SideMenu.tsx';
import { signal } from '@preact/signals-react';
import ProgressSection, { showProgressChart } from './ProgressSection.tsx';
import { ConfigContext } from '../context/ConfigContext.tsx';
import MobileProgress from './MobileProgress.tsx';
import { Toaster } from './ui/toaster';
import { getSessionHistory } from '../lib/history.ts';
import { extractIdParam } from '../lib/urlParamExtraction.ts';

export const expanded = signal(false);

function toggleExpanded() {
  expanded.value = !expanded.value;
}

function RegistrationMessage() {
  const { displayRegistrationMessage } = useContext(ChatContext);
  if (!displayRegistrationMessage) return null;
  return (
    <section className="flex flex-col justify-center p-4 m-4 border border-[#d9d9d9]">
      <h5 className="mb-1 font-large font-bold">Heads Up!</h5>
      <p>
        Please{' '}
        <a
          href="https://www.onepointltd.com/data-wellness/onepoint-d-well/"
          target="_blank"
          className="default-link"
        >
          register
        </a>{' '}
        to continue using the app.
      </p>
    </section>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    showSidebar,
    setDisplayRegistrationMessage,
    displayRegistrationMessage,
  } = useContext(ChatContext);
  const { state: configState } = useContext(ConfigContext);
  const { initConfig } = configState;

  useEffect(() => {
    if (getSessionHistory().length > 0 && !extractIdParam()) {
      setDisplayRegistrationMessage(true);
    }
  }, []);

  return (
    <section className="flex flex-col">
      <Header />
      <RegistrationMessage />
      {!displayRegistrationMessage && (
        <section className="flex flex-row">
          {showSidebar && (
            <div
              className={`side-menu w-12 md:w-14  hidden sm:block
        ${expanded.value ? 'expanded' : 'contracted'}`}
              onClick={toggleExpanded}
            >
              <SideMenu />
            </div>
          )}
          <section
            className={`flex flex-col ${
              !initConfig && showProgressChart.value
                ? 'w-full md:w-3/5 xl:w-[59%]'
                : 'w-full'
            } chat-main`}
          >
            {children}
          </section>
          {!initConfig && (
            <>
              <section
                className={`${
                  showProgressChart.value
                    ? 'hidden md:block md:w-[35%] xl:w-[36%] 2xl:[40%]'
                    : ''
                }`}
              >
                <ProgressSection />
              </section>
              <MobileProgress />
            </>
          )}
        </section>
      )}
      <Toaster />
    </section>
  );
}
