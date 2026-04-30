import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 bg-white border-t border-outline-variant/30">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo-favicon.png" alt="Favicon" className="w-8 h-8" />
            <div className="text-lg font-bold tracking-tighter text-on-surface">
              Research Lab
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="text-sm font-medium text-on-surface-variant tracking-widest mb-1">
              © 2026 Petrus Johannes Maas. All rights reserved.
            </div>
            <div className="text-sm font-medium text-on-surface-variant tracking-widest">
              Built with 💙 using React and Markdown.
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-4">
          <a
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-github text-lg"></i>
            GitHub
          </a>
          <a
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
            href="https://upwork.com"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-upwork text-lg"></i>
            Upwork
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
