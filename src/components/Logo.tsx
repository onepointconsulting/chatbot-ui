import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext.tsx';

export default function Logo() {
  const { logoImage, logoLink } = useContext(ChatContext);
  const logoImageElement = !!logoImage && (
    <img src={logoImage} alt="logo" className="w-52" />
  );

  return (
    <div>
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
