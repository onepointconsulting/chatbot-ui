import Header from "./Header.tsx";
import {useContext} from "react";
import {ChatContext} from "../context/ChatbotContext.tsx";

export default function Layout({children}: { children: React.ReactNode }) {
  const {title, logoImage, logoLink, isConnected} =
    useContext(ChatContext)
  return (
    <section className="chat-main flex flex-col bg-gray-100">
      <Header title={title} logoImage={logoImage} logoLink={logoLink} connected={isConnected}/>
      {children}
    </section>
  )
}