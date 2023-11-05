import React from "react";
import {Action} from "./MainChat.tsx";

function pad(num: number): string {
  return String(num).padStart(2, '0')
}

function printTime(): string {
  const now = new Date()
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function handleErrorMessage(message: string): string {
  if(message.includes('xhr poll error')) {
    return 'The server is not available. Please try again later ...'
  }
  return message
}

export default function ErrorMessage({message, dispatch}: { message: string, dispatch: React.Dispatch<Action> }) {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <div className="flex justify-between">
        <div>
          <span className="text-xs">{printTime()}</span><br/>
          <span className="font-bold">Error</span>: {handleErrorMessage(message)}
        </div>
        <div>
          <a href="#" onClick={(e) => {
            e.preventDefault()
            dispatch({type: 'clearFailure'})
          }} className="text-xs" title="close">&#10006;</a>
        </div>
      </div>
    </div>
  )
}