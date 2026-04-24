import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="absolute top-0 w-full z-50 bg-transparent">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-6 h-16">
        <Link
          to="/"
          className="text-xl font-black tracking-tight text-white"
        >
          Research Lab
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="font-body-md text-body-md font-semibold text-white border-b-2 border-white pb-1 transition-colors"
          >
            Home
          </Link>
          <a
            href="#"
            className="font-body-md text-body-md text-blue-100 hover:text-white transition-colors"
          >
            Projects
          </a>
          <a
            href="#"
            className="font-body-md text-body-md text-blue-100 hover:text-white transition-colors"
          >
            About
          </a>
        </div>
        <button className="px-6 py-2 rounded-lg font-label-md text-label-md active:scale-95 transition-all duration-150 bg-white text-primary">
          My portfolio
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
