import {Message} from "../lib/model.ts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {Position} from 'unist'
import type {ReactNode} from 'react'
import {useContext, useState} from "react";
import {PrismAsync as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {ChatContext} from "../context/ChatbotContext.tsx";
import {injectSourceLinks} from "../lib/sourceFunctions.ts";

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

async function handleCopy(text: string, setCopied: ((value: (((prevState: boolean) => boolean) | boolean)) => void)) {

    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      setCopied(true)
      setTimeout(() => setCopied(false), 5000)
    } else {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Move textarea out of the viewport so it's not visible
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        setCopied(true)
        setTimeout(() => setCopied(false), 5000)
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }

}

function CopyButton({message}: { message: Message }) {
  const [copied, setCopied]: [boolean, ((value: (((prevState: boolean) => boolean) | boolean)) => void)] = useState(false)
  const text = message.text + (!!message.sources ? `\n\nSources: ${message.sources}` : '')
  return (
    <div className="flex justify-end mr-3">
      {copied && <span className="text-sm text-gray-400 mt-2">Copied to clipboard!</span>}
      <button onClick={async () => await handleCopy(text, setCopied)}
              className="w-9 p-2 flex-none my-auto hover:bg-gray-200 rounded-full">
        <img src="/copy.svg" alt="copy"/>
      </button>
    </div>
  )
}

/**
 * Displays the messages in the chat window
 * @param data The data with all messagess
 * @constructor
 */
export default function Messages({data}: MessagesProps) {
  const {botName} = useContext(ChatContext)
  return (
    <>
      {
        data.map((message: Message, index: number) => (
          <section key={`message_${index}`}>
            <div className={`chat-message flex flex-row ${message.isUser ? 'bg-white' : ''}`}>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 text-center mt-3 w-20">{message.isUser ? "You" : botName}</span>
                <span
                  className="text-xs text-gray-400 text-center mt-1 mb-3 w-20">{message.timestamp.toLocaleTimeString()}</span>
              </div>
              <section>
                <Markdown
                  className="text-gray-900 mx-3 mt-3 markdown-body"
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ul: ({...props}) => <ul
                      className="space-y-1 text-gray-500 list-disc dark:text-gray-400" {...props} />,
                    ol: ({...props}) => <ol
                      className="space-y-3 text-gray-500 list-decimal dark:text-gray-400 my-3 mx-4" {...props} />,
                    p: ({...props}) => <p className="font-sans pb-4 sm:pb-2" {...props} />,
                    code({...props}) {
                      // @ts-ignore
                      return <Code {...props} />;
                    }
                  }}
                >{message.text}</Markdown>
                {!!message.sources &&
                  <div className="text-sm text-gray-400 mt-2 px-3">
                    Sources: <span dangerouslySetInnerHTML={{__html: injectSourceLinks(message.sources)}}/></div>}
              </section>
            </div>
            {!message.isUser && (
              <CopyButton message={message}/>
            )}
          </section>
        ))
      }
    </>
  )
}