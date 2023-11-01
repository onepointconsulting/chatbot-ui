import React from "react";
import {Action} from "./MainChat.tsx";

function pad(num: number): string {
  return String(num).padStart(2, '0')
}

function printTime(): string {
  const now = new Date()
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

export default function ErrorMessage({message, dispatch}: { message: string, dispatch: React.Dispatch<Action> }) {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <div className="flex justify-between">
        <div>
          <span className="font-bold">Error</span>: {message}<br/>
          {printTime()}
        </div>
        <div className="my-auto">
          <a href="close" onClick={(e) => {
            e.preventDefault()
            dispatch({type: 'clearFailure'})
          }}>&#10006;</a>
        </div>
      </div>
    </div>
  )
}