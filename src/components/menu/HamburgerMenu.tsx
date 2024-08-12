import {useContext, useRef, useState} from 'react';
import {ChatContext} from '../../context/ChatContext.tsx';
import StartMenuItem from "./StartMenuItem.tsx";

const SHOW_CONNECTED = false;

export default function HamburgerMenu() {
  const {isConnected} = useContext(ChatContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLMenuElement>(null);

  return (
    <section className="hamburger-menu">
      <section>
        <svg
          width="27"
          height="30"
          viewBox="0 0 27 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-4 mr-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <path
            d="M25.9453 13.8281H1.05469C0.472184 13.8281 0 14.3528 0 15C0 15.6472 0.472184 16.1719 1.05469 16.1719H25.9453C26.5278 16.1719 27 15.6472 27 15C27 14.3528 26.5278 13.8281 25.9453 13.8281Z"
            fill="#4A4A4A"
          />
          <path
            d="M25.9453 4.45312H1.05469C0.472184 4.45312 0 4.97777 0 5.625C0 6.27223 0.472184 6.79688 1.05469 6.79688H25.9453C26.5278 6.79688 27 6.27223 27 5.625C27 4.97777 26.5278 4.45312 25.9453 4.45312Z"
            fill="#4A4A4A"
          />
          <path
            d="M25.9453 23.2031H1.05469C0.472184 23.2031 0 23.7278 0 24.375C0 25.0222 0.472184 25.5469 1.05469 25.5469H25.9453C26.5278 25.5469 27 25.0222 27 24.375C27 23.7278 26.5278 23.2031 25.9453 23.2031Z"
            fill="#4A4A4A"
          />
        </svg>
      </section>
      {open && (
        <menu ref={menuRef} className="animate-fade-down">
          <StartMenuItem/>
        </menu>
      )}
      {SHOW_CONNECTED && (
        <span className="text-sm block">
            {isConnected === null
              ? ''
              : isConnected
                ? 'connected'
                : 'disconnected'}
          </span>
      )}
    </section>
  );
}
