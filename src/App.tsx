import './App.css'
import './css/layout_full_screen.css'
import MainChat from "./components/MainChat.tsx";
import {ChatContextProvider} from "./context/ChatbotContext.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Upload from "./components/Upload.tsx";
import Layout from "./components/Layout.tsx";
import {QueryClient, QueryClientProvider} from "react-query";

function App() {

  const queryClient = new QueryClient();

  return (
    <ChatContextProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/upload" element={<Upload/>}/>
              <Route path="*" element={<MainChat/>}/>
            </Routes>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </ChatContextProvider>
  )
}

export default App
