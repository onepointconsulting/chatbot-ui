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
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/upload" element={<Upload/>}/>
            <Route path="*" element={<MainChat/>}/>
          </Routes>
        </BrowserRouter>
      </Layout>
    </ChatContextProvider>
  )
}

export default App
