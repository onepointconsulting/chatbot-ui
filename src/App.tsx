import './App.css';
import './css/layout_full_screen.css';
import { ChatContextProvider } from './context/ChatContext.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Upload from './components/Upload.tsx';
import Layout from './components/Layout.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import MainChatParent from './components/MainChatParent.tsx';

function App() {
  const queryClient = new QueryClient();

  return (
    <ChatContextProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/upload" element={<Upload />} />
              <Route path="*" element={<MainChatParent />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </ChatContextProvider>
  );
}

export default App;
