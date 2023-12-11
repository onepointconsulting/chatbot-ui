import Header from "./Header.tsx";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext.tsx";
import SideMenu from "./SideMenu.tsx";
import { signal } from "@preact/signals-react";

export const expanded = signal(false);

function toggleExpanded() {
  expanded.value = !expanded.value;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { title, logoImage, logoLink, isConnected, showSidebar } =
    useContext(ChatContext);
  return (
    <main className="flex flex-col justify-between w-full h-screen">
      {/* Header content */}
      <Header
        title={title}
        logoImage={logoImage}
        logoLink={logoLink}
        connected={isConnected}
      />

      {/* Sidebar */}
      {showSidebar && (
        <div
          className={`side-menu w-12 md:w-14 bg-gray-50 hidden sm:block
        ${expanded.value ? "expanded" : "contracted"}`}
          onClick={toggleExpanded}
        >
          <SideMenu />
        </div>
      )}

      {/* Messages */}
      <section className="relative w-full h-full mt-auto">{children}</section>
    </main>
  );
}
