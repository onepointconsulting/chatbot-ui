import {Link} from "react-router-dom"
import {FaHome, FaUpload} from 'react-icons/fa';
import {expanded} from "./Layout.tsx";

const menus = [
  {
    link: '/',
    title: 'Home',
    icon: <FaHome size={20} title="Home" className="fill-blue-700 mr-1 menu-icon"/>
  },
  {
    link: '/upload',
    title: 'Upload',
    icon: <FaUpload size={20} title="Upload" className="fill-blue-700 mr-1 menu-icon"/>
  }
]

export default function SideMenu() {

  return (
    <div className={`mt-20 ml-2 md:ml-3 menu-icon`}>
      {menus.map((menu, index) => (
        <div className="my-8" key={index}>
          <Link to={menu.link} className="flex" onClick={(e) => e.stopPropagation()}>
            {menu.icon}
            {expanded.value && <span className="text-sm">{menu.title}</span>}
          </Link>
        </div>
      ))}
    </div>
  )
}