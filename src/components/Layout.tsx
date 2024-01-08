import Header from './Header.tsx';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext.tsx';
import SideMenu from './SideMenu.tsx';
import { signal } from '@preact/signals-react';
import ProgressIframe, {showProgressChart} from "./ProgressIframe.tsx";

export const expanded = signal(false);

function toggleExpanded() {
  expanded.value = !expanded.value;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { title, logoImage, logoLink, isConnected, showSidebar } =
    useContext(ChatContext);
  return (
    <section className="flex flex-col bg-[#E6F3FB]">
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
        <section className={`flex flex-col ${showProgressChart.value ? 'w-full md:w-3/4 lg:w-4/6 xl:w-7/12' : 'w-full'} chat-main`}>
          <Header
            title={title}
            logoImage={logoImage}
            logoLink={logoLink}
            connected={isConnected}
          />
          {children}
        </section>
        <section className={`${showProgressChart.value ? 'hidden md:block md:w-1/4 lg:w-2/6  xl:w-5/12' : ''}`}>
          <ProgressIframe/>
        </section>
      </section>
    </section>
  );
}
