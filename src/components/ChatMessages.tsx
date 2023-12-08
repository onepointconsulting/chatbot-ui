import { Message } from "../lib/model.ts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Position } from "unist";
import type { ReactNode } from "react";
import { useContext, useState } from "react";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChatContext } from "../context/ChatContext.tsx";
import Sources from "./Sources.tsx";

type MessagesProps = { data: Message[]; isLoading: boolean };

export type ComponentPropsWithoutRef<T extends React.ElementType<any>> =
  import("react").ComponentPropsWithoutRef<T>;

export type ReactMarkdownProps = {
  node: Element;
  children: ReactNode[];
  /**
   * Passed when `options.rawSourcePos` is given
   */
  sourcePosition?: Position;
  /**
   * Passed when `options.includeElementIndex` is given
   */
  index?: number;
  /**
   * Passed when `options.includeElementIndex` is given
   */
  siblingCount?: number;
};

export type CodeProps = ComponentPropsWithoutRef<"code"> &
  ReactMarkdownProps & {
    inline?: boolean;
  };

function Code({ inline, children, ...props }: CodeProps) {
  const match = /language-(\w+)/.exec(props.className || "") || "Python";
  return (
    <SyntaxHighlighter
      {...props}
      children={String(children).replace(/\n$/, "")}
      style={dracula}
      customStyle={{ paddingRight: "2.5em" }}
      wrapLongLines
      language={match[1]}
      PreTag="div"
    />
  );
}

async function handleCopy(
  text: string,
  setCopied: (value: ((prevState: boolean) => boolean) | boolean) => void
) {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
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
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
}

function CopyButton({ message }: { message: Message }) {
  const [copied, setCopied]: [
    boolean,
    (value: ((prevState: boolean) => boolean) | boolean) => void
  ] = useState(false);
  const text =
    message.text + (!!message.sources ? `\n\nSources: ${message.sources}` : "");
  return (
    <div className="flex justify-end mr-3">
      {copied && (
        <span className="mt-2 text-sm text-gray-400">Copied to clipboard!</span>
      )}
      <button
        onClick={async () => await handleCopy(text, setCopied)}
        className="flex-none p-2 my-auto rounded-full w-9 hover:bg-gray-200"
      >
        <img src="/copy.svg" alt="copy" />
      </button>
    </div>
  );
}

/**
 * Displays the messages in the chat window
 * @param data The data with all messagess
 * @constructor
 */
export default function Messages({ data, isLoading }: MessagesProps) {
  const { botName, uploadedFilesUrl } = useContext(ChatContext);
  console.log("Checking isLoading", isLoading);

  return (
    <>
      {data.map((message: Message, index: number) => (
        <section key={`message_${index}`}>
          <div
            className={`chat-message flex flex-row ${
              message.isUser ? "bg-white" : ""
            }`}
          >
            <div className="flex-none mt-3 ml-4 text-sm text-center text-gray-500 min-w-24">
              <img
                src={message.isUser ? "/user.png" : "/bot.png"}
                alt={message.isUser ? "user" : botName}
                className="w-6 h-6 mx-auto md:w-8 md:h-8"
              />
            </div>
            <div className="mr-5 grow">
              <div className="flex flex-col ml-3">
                <span className="mt-3 text-sm font-bold text-gray-500">
                  {message.isUser ? "You" : botName}
                </span>
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div
                className={`chat-message flex flex-row mt-1 mx-3 ${
                  message.isUser ? "bg-white" : ""
                }`}
              >
                <section>
                  <Markdown
                    className="mt-1 text-gray-900 markdown-body"
                    remarkPlugins={[remarkGfm]}
                    components={{
                      ul: ({ ...props }) => (
                        <ul
                          className="mb-3 ml-5 space-y-1 text-gray-500 list-disc dark:text-gray-400"
                          {...props}
                        />
                      ),
                      ol: ({ ...props }) => (
                        <ol
                          className="mx-4 my-3 space-y-3 text-gray-500 list-decimal dark:text-gray-400"
                          {...props}
                        />
                      ),
                      p: ({ ...props }) => (
                        <p className="pb-1 font-sans" {...props} />
                      ),
                      a: ({ children, ...props }) => (
                        <a
                          className="pb-4 font-sans underline sm:pb-2"
                          {...props}
                          target="_blank"
                        >
                          {children}
                        </a>
                      ),
                      code({ ...props }) {
                        // @ts-ignore
                        return <Code {...props} />;
                      },
                    }}
                  >
                    {message.text}
                  </Markdown>
                  {!!uploadedFilesUrl && <Sources message={message} />}
                </section>
              </div>

              {/* Copy to clipboard */}
              {!message.isUser && !isLoading && (
                <CopyButton message={message} />
              )}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
