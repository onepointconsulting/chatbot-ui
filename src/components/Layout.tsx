import Header from "./Header.tsx";
import {useContext} from "react";
import {ChatContext} from "../context/ChatbotContext.tsx";
import SideMenu from "./SideMenu.tsx";

export default function Layout({children}: { children: React.ReactNode }) {
  const {title, logoImage, logoLink, isConnected} =
    useContext(ChatContext)
  return (
    <section className="flex flex-row">
      <div className="w-12 md:w-14 bg-gray-50"><SideMenu /></div>
      <section className="chat-main flex flex-col bg-gray-100 w-full">
        <Header title={title} logoImage={logoImage} logoLink={logoLink} connected={isConnected}/>
        {children}
      </section>
    </section>
  )
}