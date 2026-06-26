import React from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  content: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, slug, content }) => {
  if (!isOpen) return null;

  const postUrl = `${window.location.origin}/post/${slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleX = () => {
    window.open(
      `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Check out: ${title}`);
    const body = encodeURIComponent(`I thought you might find this interesting:\n\n${title}\n\n${postUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Share this post</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-3">
          <button
            onClick={handleLinkedIn}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-on-surface">LinkedIn</p>
              <p className="text-sm text-on-surface-variant">Share on your professional network</p>
            </div>
          </button>

          <button
            onClick={handleX}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-on-surface">X (Twitter)</p>
              <p className="text-sm text-on-surface-variant">Share with your followers</p>
            </div>
          </button>

          <button
            onClick={handleEmail}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-xl">mail</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">Email</p>
              <p className="text-sm text-on-surface-variant">Send via email</p>
            </div>
          </button>

          <div className="border-t border-outline-variant/30 my-2"></div>

          <button
            onClick={handleDownload}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-xl">download</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">Download as Markdown</p>
              <p className="text-sm text-on-surface-variant">Save this post as a .md file</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
