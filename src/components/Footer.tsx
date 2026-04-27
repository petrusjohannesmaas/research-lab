import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 mt-auto bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="text-lg font-bold text-slate-900 dark:text-white">Research Lab Blog</div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">© 2026 Research Lab. Built with precision.</p>
        </div>
        <div className="flex items-center gap-8">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-primary transition-colors font-body-sm text-sm hover:underline decoration-primary underline-offset-4"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-primary transition-colors font-body-sm text-sm hover:underline decoration-primary underline-offset-4"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
