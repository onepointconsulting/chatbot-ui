type HeaderType = {
  title?: string,
  logoImage?: string,
  logoLink?: string,
  connected: boolean,
}

function Logo({logoImage, logoLink}: { logoImage?: string, logoLink?: string }) {

  const logoImageElement = !!logoImage && <img src={logoImage} alt="logo" className="h-10 mr-2 m-1"/>

  return (
    <div className="flex flex-row">
      {!logoLink ? logoImageElement : <a href={logoLink} target="_blank">{logoImageElement}</a>}
    </div>
  )
}

export default function Header({title, logoImage, logoLink, connected}: HeaderType) {
  return (
    <div className="chat-header p-2 bg-black text-white w-full flex justify-between">
      <div className="flex flex-row">
        {<Logo logoLink={logoLink} logoImage={logoImage} />}
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      </div>
      {<div className="mt-auto">{connected ? "connected" : "disconnected"}</div>}
    </div>
  )
}