import {signal} from "@preact/signals-react";

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

export default function Header({title, logoImage, logoLink, connected}: HeaderType) {
  return (
    <div className="chat-header p-2 w-full flex justify-between">
      <div className="flex flex-row">
        {<Logo logoLink={logoLink} logoImage={logoImage}/>}
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      </div>
      <div className="mt-auto mb-2 text-xs flex flex-col">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24"
          className="ml-auto sm:hidden block">
          <path
                d="M3 8a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm0 8a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z"></path>
        </svg>
        <span className="hidden sm:block">{connected === null ? "" : connected === true ? "connected" : "disconnected"}</span>
      </div>
      {/*TODO: Add menu items here*/}
    </div>
  )
}