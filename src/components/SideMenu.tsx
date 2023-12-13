import { Link } from 'react-router-dom';
import { FaHome, FaUpload } from 'react-icons/fa';
import { expanded } from './Layout.tsx' 
import { Signal } from '@preact/signals-react';

const menus = [
  {













    
    link: '/',
    title: 'Home',
    icon: (
      <FaHome size={20} title="Home" className="mr-1 fill-blue-700 menu-icon" />
    ),
  },
  {
    link: '/upload',
    title: 'Upload',
    icon: (
      <FaUpload
        size={20}
        title="Upload"
        className="mr-1 fill-blue-700 menu-icon"
      />
    ),
  },
];

export default function SideMenu({
  mobile = false,
  menuHeaderExpanded,
}: {
  mobile?: boolean;
  menuHeaderExpanded?: Signal<boolean>;









  
}) {
  return (
    <div
      className={
        mobile
          ? 'fixed w-full left-0 z-40 bg-gray-50 top-14 h-full block sm:hidden'
          : 'mt-20 ml-2 md:ml-3 menu-icon'
      }
    >
      {menus.map((menu, index) => (
        <div className={mobile ? 'ml-2 my-6' : 'my-8'} key={index}>
          <Link
                                     to={menu.link}
            className="flex"
            onClick={(e) => {

              
              e.stopPropagation();
              
              
              if (mobile && menuHeaderExpanded)
              

              
                                      menuHeaderExpanded.value = false;
            }}
          >
            {menu.icon}
            {(expanded.value || mobile) && (
              <span className="text-sm">{menu.title}</span>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
}
