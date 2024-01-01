import {FaDownload} from 'react-icons/fa';
import {useContext} from "react";
import {ChatContext} from "../../context/ChatContext.tsx";
import {getSession} from "../../lib/sessionFunctions.ts";
import {Session} from "../../model/session.ts";

export default function ReportDownload() {

  const {reportUrl} = useContext(ChatContext)

  function downloadReport() {
    if (reportUrl) {
      const session: Session | null = getSession()
      if (session) {
        location.href = `${reportUrl}/${session.id}`;
      }
    }
  }

  if (!reportUrl) return <></>
  return <button className="my-auto p-2 mr-2 rounded-full border-2 border-black" onClick={downloadReport}><FaDownload
    size={20}
    title="Download report"
  /></button>
}