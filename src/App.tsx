import './App.css'
import './css/layout_full_screen.css'
import MainChat from "./components/MainChat.tsx";
import {ChatContextProvider} from "./context/ChatbotContext.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Upload from "./components/Upload.tsx";
import Layout from "./components/Layout.tsx";

function App() {
  return (
    <ChatContextProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/upload" element={<Upload/>}/>
            <Route path="*" element={<MainChat/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </ChatContextProvider>
  )
}

export default App
