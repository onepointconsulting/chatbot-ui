import Header from './Header.tsx';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext.tsx';
import SideMenu from './SideMenu.tsx';
import { signal } from '@preact/signals-react';
import ProgressSection, { showProgressChart } from './ProgressSection.tsx';
import { ConfigContext } from '../context/ConfigContext.tsx';
import MobileProgress from './MobileProgress.tsx';

export const expanded = signal(false);

function toggleExpanded() {
  expanded.value = !expanded.value;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { title, isConnected, showSidebar } = useContext(ChatContext);
  const { state: configState } = useContext(ConfigContext);
  const { initConfig } = configState;
  return (
    <section className="flex flex-col">
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
          <Header title={title} connected={isConnected} />
          {children}
        </section>
        {!initConfig && (
          <>
            <section
              className={`${
                showProgressChart.value
                  ? 'hidden md:block md:w-[37%] xl:w-[39%]'
                  : ''
              }`}
            >
              <ProgressSection />
            </section>
            <MobileProgress />
          </>
        )}
      </section>
    </section>
  );
}
