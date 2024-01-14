export default function DialogMessage({message, isError}: {message: string | undefined, isError: boolean}) {
  if(!message) return <></>
  return (
    <div className={`flex flex-col items-center justify-center w-full h-full p-4 bg-white border border-gray-300 rounded shadow-lg 
      ${isError ? 'text-red-800' : ''}`}>
      {message}
    </div>
  )
}