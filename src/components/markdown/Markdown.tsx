import Markdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import {CodeProps} from "../../model/chatMessage.ts";
import {PrismAsync as SyntaxHighlighter} from "react-syntax-highlighter";
import {dracula} from "react-syntax-highlighter/dist/esm/styles/prism";

function Code({inline, children, ...props}: CodeProps) {
  const match = /language-(\w+)/.exec(props.className || '') || 'Python';
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
 * Component used to render a markdown section.
 * @param content The content to be rendered.
 * @param userStyle The style to in case this is a user message.
 * @constructor
 */
export default function MarkdownSection({content, userStyle}: { content: string, userStyle: string }) {
  return (
    <Markdown
      className={`mt-1 text-gray-900 markdown-body ${userStyle}`}
      remarkPlugins={[remarkGfm]}
      components={{
        ul: ({...props}) => (
          <ul
            className="mb-3 ml-5 space-y-1 text-gray-500 list-disc dark:text-gray-400"
            {...props}
          />
        ),
        ol: ({...props}) => (
          <ol
            className="mx-4 my-3 space-y-3 text-gray-500 list-decimal dark:text-gray-400"
            {...props}
          />
        ),
        li: ({...props}) => <li className="mt-0" {...props} />,
        p: ({...props}) => (
          <p className="pb-1 font-sans" {...props} />
        ),
        a: ({children, ...props}) => (
          <a
            className="pb-4 font-sans underline sm:pb-2"
            {...props}
            target="_blank"
          >
            {children}
          </a>
        ),
        code({...props}) {
          // @ts-ignore
          return <Code {...props} />;
        },
      }}
    >
      {content}
    </Markdown>
  )
}