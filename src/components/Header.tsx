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
    <header className="flex flex-row justify-between w-full p-4 chat-header">
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

      {/* Server status */}
      <span className="text-sm block">
        {connected === null
          ? ''
          : connected === true
            ? 'connected'
            : 'disconnected'}
      </span>
      {/*TODO: Add menu items here*/}
    </header>
  );
}
