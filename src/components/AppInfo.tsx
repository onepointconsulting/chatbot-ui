import {signal} from "@preact/signals-react";
import {Action} from "./MainChat.tsx";
import {Socket} from "socket.io-client";
import sendWSMessage from "../lib/websocketClient.ts";

const displayInfo = signal(true)

const exampleQuestions =
  [
    "Can you give us a quick intro to the client and the problem they wanted to solve that led them to reach out to OnePoint?",
    "What were some of the key challenges and pain points their travel management teams were facing day-to-day?",
    "We'd love to hear more about the workshop approach you took to deeply understand their needs. How did that set you up to deliver an innovative solution?",
    "Walk us through some of the biggest improvements and benefits the new data platform drove for their business.",
    "For other tech leaders and innovators in our community, what are 1-2 key takeaways or lessons you want them to learn from this success story with a leading travel company?",
    "Which are Onepoint's credentials in the energy sector?",
    "How does Onepoint bring value to its clients?",
    "Which technologies is Onepoint proficient with?",
    "Which credentials does Onepoint have in the travel industry?",
    "What is Onepoint's approach to software development?",
    "How can I contact Onepoint?"
  ]

function ListItem({question, index, connected, dispatch, socket}: {
  question: string,
  index: number,
  dispatch: React.Dispatch<Action>,
  connected: boolean,
  socket: React.MutableRefObject<Socket | null>
}) {
  return (
    <div
      className={`text-sm text-gray-500 mb-${index === exampleQuestions.length - 1 ? '3' : '1'}`}>
      <a href="#" onClick={(e) => {
        if (connected) {
          dispatch({type: 'request', message: {text: question, isUser: true, timestamp: new Date()}})
          sendWSMessage(question, socket.current)
        }
        e.preventDefault()
      }} className="underline">{question}</a>
    </div>
  )
}

export default function AppInfo(
  {dispatch, connected, socket}: {
    dispatch: React.Dispatch<Action>,
    connected: boolean,
    socket: React.MutableRefObject<Socket | null>
  }
) {
  return (
    <div
      className={`border-l-4 border-blue-400 flex bg-blue-50 h-auto overflow-y-auto`}>
      <div className="chat-message flex flex-col bg-gradient-to-b mx-5 w-11/12 pb-4">
        <span className="text-sm text-gray-500 mt-3 mb-1">Please ask us any Onepoint related questions. Things you could ask:</span>
        {displayInfo.value && exampleQuestions.map((question: string, index: number) => <ListItem
          key={`question_${index}`} question={question} index={index}
          socket={socket} dispatch={dispatch}
          connected={connected}/>)}
      </div>
      <div className="mt-4 w-1/12 pr-4 flex justify-end">
        <a href="#" onClick={(e) => {
          e.preventDefault()
          displayInfo.value = !displayInfo.value
        }} title="close"><img src={displayInfo.value ? 'expand-up.svg' : 'expand-down.svg'}
                                              title="Hide" alt="Hide"/></a>
      </div>
    </div>
  )
}