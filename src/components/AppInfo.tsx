import {signal} from "@preact/signals-react";

const displayInfo = signal(true)

export default function AppInfo() {

  if(!displayInfo.value) {
    return <></>
  }
  return (
    <div className="border-l-4 border-blue-400 flex justify-between bg-blue-50">
      <div className="chat-message flex flex-col bg-gradient-to-b mx-5">
        <span className="text-sm text-gray-500 mt-3 mb-1">Please ask us any Onepoint related questions. Things you could ask:</span>
        <li className="text-sm text-gray-500 mb-1">How does Onepoint bring value to its clients?</li>
        <li className="text-sm text-gray-500 mb-1">Which technologies is Onepoint proficient with?</li>
        <li className="text-sm text-gray-500 mb-3">Which credentials does Onepoint have in the travel industry?
        </li>
      </div>
      <div className="mb-auto mr-3 mt-4">
        <a href="#" onClick={(e) => {
          e.preventDefault()
          displayInfo.value = false
        }} title="close" className="text-xs">&#10006;</a>
      </div>
    </div>
  )
}