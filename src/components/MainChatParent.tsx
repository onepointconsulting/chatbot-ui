import { MessageContextProvider } from '../context/MessageContext.tsx';
import MainChat from './MainChat.tsx';

export default function MainChatParent() {
  return (
    <>
      <MessageContextProvider>
        <MainChat />
      </MessageContextProvider>
    </>
  );
}
