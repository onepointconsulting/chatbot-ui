import {Circles, Vortex} from "react-loader-spinner";

const SPINNER_SIZE = 50

function SpinnerLayout({children}: { children: React.ReactNode }) {
  return <div className="chat-message flex flex-col mx-auto">
    {children}
  </div>
}

export default function SpinnerComment() {
  return (
    <SpinnerLayout>
            <span className="text-sm text-gray-500 my-3 mx-auto"><Circles
              visible={true}
              height={SPINNER_SIZE}
              width={SPINNER_SIZE}
              ariaLabel="comment-loading"
              wrapperStyle={{}}
              wrapperClass="comment-wrapper"
              color="gray"
            /></span>
    </SpinnerLayout>
  )
}

export function SpinnerUpload() {
  return (
    <SpinnerLayout>
      <Vortex />
    </SpinnerLayout>
  )
}