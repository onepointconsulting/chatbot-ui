import {Message} from "../lib/model.ts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {Position} from 'unist'
import type {ReactNode} from 'react'
import {PrismAsync as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {useContext} from "react";
import {ChatContext} from "../context/ChatbotContext.tsx";

type MessagesProps = { data: Message[] };

export type ComponentPropsWithoutRef<T extends React.ElementType<any>> =
  import('react').ComponentPropsWithoutRef<T>

export type ReactMarkdownProps = {
  node: Element
  children: ReactNode[]
  /**
   * Passed when `options.rawSourcePos` is given
   */
  sourcePosition?: Position
  /**
   * Passed when `options.includeElementIndex` is given
   */
  index?: number
  /**
   * Passed when `options.includeElementIndex` is given
   */
  siblingCount?: number
}

export type CodeProps = ComponentPropsWithoutRef<'code'> &
  ReactMarkdownProps & {
  inline?: boolean
}

function Code({inline, children, ...props}: CodeProps) {
  const match = /language-(\w+)/.exec(props.className || '') || "Python"
  return (
    <SyntaxHighlighter
      {...props}
      children={String(children).replace(/\n$/, '')}
      style={dracula}
      customStyle={{paddingRight: '2.5em'}}
      wrapLongLines
      language={match[1]}
      PreTag="div"
    />
  );
}

/**
 * Displays the messages in the chat window
 * @param data The data with all messagess
 * @constructor
 */
export default function Messages({data}: MessagesProps) {
  const { botName } = useContext(ChatContext)
  return (
    <>
      {
        data.map((message: Message, index: number) => (
          <div key={index} className={`chat-message flex flex-row ${message.isUser ? 'bg-white' : ''}`}>
            <div className="flex flex-col w-20">
              <span className="text-sm text-gray-500 text-center mt-3 w-20">{message.isUser ? "You" : botName}</span>
              <span className="text-xs text-gray-400 text-center mt-1 mb-3 w-20">{message.timestamp.toLocaleTimeString()}</span>
            </div>
            <Markdown
              className="text-gray-900 mx-3 my-3 markdown-body"
              remarkPlugins={[remarkGfm]}
              components={{
                ul: ({...props}) => <ul className="space-y-1 text-gray-500 list-disc dark:text-gray-400" {...props} />,
                ol: ({...props}) => <ol
                  className="space-y-3 text-gray-500 list-decimal dark:text-gray-400 my-3 mx-4" {...props} />,
                p: ({...props}) => <p className="font-sans" {...props} />,
                code({...props}) {
                  // @ts-ignore
                  return <Code {...props} />;
                }
              }}
            >{message.text}</Markdown>
          </div>
        ))
      }
    </>
  )
}