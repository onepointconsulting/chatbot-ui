import {signal} from "@preact/signals-react";
import SideMenu from "./SideMenu.tsx";
import {useContext} from "react";
import {ChatContext} from "../context/ChatContext.tsx";

type HeaderType = {
  title?: string,
  logoImage?: string,
  logoLink?: string,
  connected?: boolean,
}

function Logo({logoImage, logoLink}: { logoImage?: string, logoLink?: string }) {

  const logoImageElement = !!logoImage && <img src={logoImage} alt="logo" className="h8 md:h-10 mr-2 m-1"/>

  return (
    <div className="flex flex-row">
      {!logoLink ? logoImageElement : <a href={logoLink} target="_blank">{logoImageElement}</a>}
    </div>
  )
}

const menuHeaderExpanded = signal(false)

function onMenuHeaderClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  e.preventDefault()
  menuHeaderExpanded.value = !menuHeaderExpanded.value
}

export default function Header({title, logoImage, logoLink, connected}: HeaderType) {
  const {showSidebar} = useContext(ChatContext)
  return (
    <div className="chat-header p-2 w-full flex justify-between">
      <div className="flex flex-row">
        {<Logo logoLink={logoLink} logoImage={logoImage}/>}
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      </div>
      {showSidebar && <div className="mt-auto mb-2 text-xs flex flex-col sm:hidden">
        {!menuHeaderExpanded.value ?
          <a href="#" onClick={onMenuHeaderClick}><img alt="Show Menu" title="Show Menu" src="./menu-icon.svg"
                                                       className="ml-auto"/></a> :
          <a href="#" onClick={onMenuHeaderClick}>&#10006;</a>}
        {menuHeaderExpanded.value && <SideMenu mobile={true} menuHeaderExpanded={menuHeaderExpanded}/>}
      </div>}
      <span
        className="hidden sm:block text-sm text-gray-400">{connected === null ? "" : connected === true ? "connected" : "disconnected"}</span>
      {/*TODO: Add menu items here*/}
    </div>
  )
}