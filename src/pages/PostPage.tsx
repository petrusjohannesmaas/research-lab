import React, { useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../utils/posts';
import { getRandomImage } from '../utils/images';
import ShareModal from '../components/ShareModal';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = useMemo(() => (slug ? getPostBySlug(slug) : undefined), [slug]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Random image cycled when a post is opened
  const headerImage = useMemo(() => getRandomImage(), [slug]);

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <div className="flex flex-col min-h-screen relative pt-20">
      {/* Post Hero Section */}
      <header className="relative w-full h-[614px] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={headerImage}
          alt={post.title}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background"></div>
        <div className="relative z-10 max-w-[1200px] w-full px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full font-bold text-[13px] tracking-wider uppercase shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-5xl mx-auto mb-8 tracking-tight leading-[1.1] [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-8 text-blue-50 font-medium text-base [text-shadow:_0_1px_4px_rgb(0_0_0_/_40%)]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto px-6 py-section-gap w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Main Content */}
          <article className="lg:col-span-8">
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre({ children }: any) {
                    try {
                      const codeElement = React.Children.only(children) as any;
                      const content = String(codeElement.props.children).replace(/\n$/, '');

                      return (
                        <div className="relative group my-8">
                          <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigator.clipboard.writeText(content);
                                const btn = e.currentTarget;
                                const originalHtml = btn.innerHTML;
                                btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check</span>';
                                btn.classList.add('bg-green-500/20', 'text-green-600', 'border-green-500/30');
                                setTimeout(() => {
                                  btn.innerHTML = originalHtml;
                                  btn.classList.remove('bg-green-500/20', 'text-green-600', 'border-green-500/30');
                                }, 2000);
                              }}
                              className="bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 p-2 rounded-lg backdrop-blur-md border border-slate-900/10 transition-all active:scale-95 flex items-center justify-center"
                              title="Copy to clipboard"
                            >
                              <span className="material-symbols-outlined text-[18px]">content_copy</span>
                            </button>
                          </div>
                          <pre className="bg-surface-container-low border border-outline-variant rounded-xl p-6 overflow-x-auto overflow-y-hidden text-sm md:text-base leading-relaxed">
                            {children}
                          </pre>
                        </div>
                      );
                    } catch (e) {
                      return <pre className="bg-surface-container-low border border-outline-variant rounded-xl p-6 overflow-x-auto overflow-y-hidden">{children}</pre>;
                    }
                  },
                  code({ node, inline, className, children, ...props }: any) {
                    if (inline) {
                      return <code className="font-code text-primary bg-surface-container px-1.5 py-0.5 rounded text-[0.9em]" {...props}>{children}</code>;
                    }
                    return <code className={className} {...props}>{children}</code>;
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Right Column: Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Author Box */}
              <div className="bg-white border border-outline-variant rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-outline-variant shrink-0 bg-surface-container">
                    <img
                      src="/avatar.png"
                      alt={post.author}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-lg text-on-surface truncate">{post.author}</p>
                    <p className="font-body-sm text-sm text-on-surface-variant">IT Specialist & Full Stack Developer</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                  <p className="text-sm font-medium text-on-surface-variant">Connect & Share</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsShareModalOpen(true)}
                      className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-[20px]">share</span>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-[20px]">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-sm">Newsletter</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-stack-md">Get the latest technical insights delivered bi-weekly.</p>
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-3"
                  placeholder="email@example.com"
                  type="email"
                />
                <button className="w-full bg-primary text-on-primary font-bold text-label-md py-3 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]">
                  Subscribe Now
                </button>
              </div>

              <Link
                to="/"
                className="flex items-center justify-center gap-2 text-primary font-semibold hover:underline"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back to all posts
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={post.title}
        slug={slug || ''}
        content={post.content}
      />

      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span className="font-medium text-sm">Link copied to clipboard</span>
        </div>
      )}
    </div>
  );
};

export default PostPage;
