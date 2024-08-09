import { signal } from '@preact/signals-react';
import SideMenu from './SideMenu.tsx';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext.tsx';
import Logo from './Logo.tsx';

type HeaderType = {
  title?: string;
  connected?: boolean;
};

const menuHeaderExpanded = signal(false);

function onMenuHeaderClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  e.preventDefault();
  menuHeaderExpanded.value = !menuHeaderExpanded.value;
}

export default function Header({ connected }: HeaderType) {
  const { showSidebar } = useContext(ChatContext);
  return (
    <div className="flex items-center justify-between w-full p-4 pr-8 chat-header">
      {/* Logo */}
      <div className="block xl:flex xl:flex-row">
        <Logo />
      </div>

      {/* Sidebar and mobile menu */}
      {showSidebar && (
        <div className="flex flex-col mt-auto mb-2 text-xs sm:hidden">
          {!menuHeaderExpanded.value ? (
            <a href="#" onClick={onMenuHeaderClick}>
              <img
                alt="Show Menu"
                title="Show Menu"
                src="./menu-icon.svg"
                className="ml-auto"
              />
            </a>
          ) : (
            <a href="#" onClick={onMenuHeaderClick}>
              &#10006;
            </a>
          )}
          {menuHeaderExpanded.value && (
            <SideMenu mobile={true} menuHeaderExpanded={menuHeaderExpanded} />
          )}
        </div>
      )}

      {/* Server status (Hidden at the moment) */}
      <span className="hidden text-sm">
        {connected === null
          ? ''
          : connected === true
            ? 'connected'
            : 'disconnected'}
      </span>

      {/*TODO: Add menu items here*/}

      <svg
        className="w-8 h-8 font-bold fill-gray-800"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 50 50"
      >
        <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"></path>
      </svg>
    </div>
  );
}
