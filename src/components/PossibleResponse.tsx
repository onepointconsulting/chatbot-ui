import {SuggestedResponse} from "../model/message.ts";


export default function SuggestedResponsePanel({possibleResponses}: {possibleResponses: SuggestedResponse[]}) {
  return (
    <div className="grid w-full grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2 mt-2 box-border pl-1 pr-3 lg:pl-5 lg:pr-8">
      {possibleResponses.map((response, index) => (
        <div key={index} className={`button-possible-response`} title={response.text}>
          <div className="truncate font-bold text-base">{response.title}</div>
          {response.subtitle && <div className="truncate text-sm opacity-50">{response.subtitle}</div>}
        </div>
      ))}
    </div>
  )
}