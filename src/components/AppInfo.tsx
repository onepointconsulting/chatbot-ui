import {signal} from "@preact/signals-react";
import {Action, handleMessageDispatch} from "./MainChat.tsx";
import {Socket} from "socket.io-client";
import sendWSMessage from "../lib/websocketClient.ts";
import {useContext} from "react";
import {ChatContext} from "../context/ChatContext.tsx";

const displayInfo = signal(true)
function ListItem({question, index, connected, dispatch, socket}: {
  question: string,
  index: number,
  dispatch: React.Dispatch<Action>,
  connected: boolean,
  socket: React.MutableRefObject<Socket | null>
}) {
  const {exampleQuestions, streaming} = useContext(ChatContext)
  if(!exampleQuestions) return <></>
  return (
    <div
      className={`text-sm text-gray-500 mb-${index === exampleQuestions.length - 1 ? '3' : '1'}`}>
      <a href="#" onClick={(e) => {
        if (connected) {
          handleMessageDispatch(dispatch, question, streaming)
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
  const { exampleQuestions, defaultQuestionsPrompt } = useContext(ChatContext);
  if(!exampleQuestions || exampleQuestions.length === 0) return <></>
  return (
    <div
      className={`border-l-4 border-blue-400 flex bg-blue-50 h-auto overflow-y-auto`}>
      <div className="chat-message flex flex-col bg-gradient-to-b mx-5 w-11/12 pb-4">
        <h4 className="sm:text-xl font-bold text-gray-500 mb-2 mt-2">{defaultQuestionsPrompt}</h4>
        {displayInfo.value && exampleQuestions?.map((question: string, index: number) => <ListItem
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