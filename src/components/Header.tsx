import { signal } from '@preact/signals-react';
import SideMenu from './SideMenu.tsx';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext.tsx';

type HeaderType = {
  title?: string;
  logoImage?: string;
  logoLink?: string;
  connected?: boolean;
};

function Logo({
  logoImage,
  logoLink,
}: {
  logoImage?: string;
  logoLink?: string;
}) {
  const logoImageElement = !!logoImage && (
    <img src={logoImage} alt="logo" className="h-8 m-1 mr-2 md:h-10" />
  );

  return (
    <div className="flex flex-row">
      {!logoLink ? (
        logoImageElement
      ) : (
        <a href={logoLink} target="_blank">
          {logoImageElement}
        </a>
      )}
    </div>
  );
}

const menuHeaderExpanded = signal(false);

function onMenuHeaderClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  e.preventDefault();
  menuHeaderExpanded.value = !menuHeaderExpanded.value;
}

export default function Header({
  title,
  logoImage,
  logoLink,
  connected,
}: HeaderType) {
  const { showSidebar } = useContext(ChatContext);
  return (
    <div className="flex justify-between w-full p-2 chat-header">
      {/* Logo */}
      <div className="flex flex-row">
        {<Logo logoLink={logoLink} logoImage={logoImage} />}
        <h2 className="text-3xl font-bold md:text-4xl text-gray-500">
          {title}
        </h2>
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
      <span className="hidden text-sm text-gray-400 sm:block">
        {connected === null
          ? ''
          : connected === true
            ? 'connected'
            : 'disconnected'}
      </span>
      {/*TODO: Add menu items here*/}
    </div>
  );
}
