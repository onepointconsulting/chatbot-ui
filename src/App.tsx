import './App.css'
import MainChat from "./components/MainChat.tsx";
import {ChatContextProvider} from "./context/ChatbotContext.tsx";

function App() {
  return (
    <ChatContextProvider>
      <MainChat />
    </ChatContextProvider>
  )
}

export default App
