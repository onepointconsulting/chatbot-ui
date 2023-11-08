import {Link} from "react-router-dom"
import {FaHome, FaUpload} from 'react-icons/fa';

export default function SideMenu() {
  return (
    <div className="mt-20 ml-3 md:ml-4">
      <div className="my-5">
        <Link to="/">
          <FaHome size={20} title="Home" className="fill-blue-700"/>
        </Link>
      </div>
      <div className="my-5">
        <Link to="/upload">
          <FaUpload size={20} title="Upload" className="fill-blue-700"/>
        </Link>
      </div>
    </div>
  )
}