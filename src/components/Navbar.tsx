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
          className="flex items-center gap-3 group"
        >
          <img
            src="/avatar.png"
            alt="PJ Maas"
            className="w-10 h-10 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors object-cover"
          />
          <span className="text-xl font-black tracking-tight text-white">
            PJ's Research Lab
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="font-body-md text-body-md font-semibold text-white border-b-2 border-white pb-1 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/study-guides"
            className="font-body-md text-body-md text-blue-100 hover:text-white transition-colors"
          >
            Study Guides
          </Link>
          <a
            href="/#about"
            className="font-body-md text-body-md text-blue-100 hover:text-white transition-colors"
          >
            About
          </a>
        </div>
        <a 
          href="https://portfolio.pjmaasdev.workers.dev/#projects" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[#1d6bf3] hover:bg-[#1558d6] text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
        >
          My portfolio
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
