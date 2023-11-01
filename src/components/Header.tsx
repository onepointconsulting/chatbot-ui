type HeaderType = {
  title?: string,
  logoImage?: string,
  connected: boolean,
}

export default function Header({title, logoImage, connected}: HeaderType) {
  return (
    <div className="chat-header p-2 bg-black text-white w-full flex justify-between">
      <div className="flex flex-row">
        {!!logoImage && <img src={logoImage} alt="logo" className="h-10 mr-2"/>}
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      </div>
      {<div className="mt-auto">{connected ? "connected" : "disconnected"}</div>}
    </div>
  )
}