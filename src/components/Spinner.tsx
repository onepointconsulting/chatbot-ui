import {Comment} from "react-loader-spinner";

const SPINNER_SIZE = 60

export default function Spinner() {
  return (
    <div className="chat-message flex flex-col mx-auto">
            <span className="text-sm text-gray-500 my-3 mx-auto"><Comment
              visible={true}
              height={SPINNER_SIZE}
              width={SPINNER_SIZE}
              ariaLabel="comment-loading"
              wrapperStyle={{}}
              wrapperClass="comment-wrapper"
              color="#fff"
              backgroundColor="#F4442E"
            /></span>
    </div>
  )
}