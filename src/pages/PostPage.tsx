import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../utils/posts';
import { getRandomImage } from '../utils/images';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = useMemo(() => (slug ? getPostBySlug(slug) : undefined), [slug]);
  
  // Random image cycled when a post is opened
  const headerImage = useMemo(() => getRandomImage(), [slug]);

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Post Hero Section */}
      <header className="relative w-full h-[614px] min-h-[500px] flex items-center justify-center pt-16 overflow-hidden">
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
                className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full font-bold text-[13px] tracking-wider uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface max-w-5xl mx-auto mb-8 tracking-tight leading-[1.1]">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-8 text-on-surface-variant font-medium text-base">
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
            <div className="font-body-lg text-body-lg text-on-surface mb-stack-lg leading-relaxed">
              {post.description}
            </div>
            <div className="w-full h-px bg-outline-variant/30 my-stack-lg"></div>
            
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </article>

          {/* Right Column: Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Author Box */}
              <div className="bg-white border border-outline-variant rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-outline-variant shrink-0 bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-outline">person</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-lg text-on-surface truncate">{post.author}</p>
                    <p className="font-body-sm text-sm text-on-surface-variant">Technical Author</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                  <p className="text-sm font-medium text-on-surface-variant">Connect & Save</p>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">share</span>
                    </button>
                    <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">bookmark</span>
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
                <button className="w-full bg-primary text-on-primary font-bold text-label-md py-3 rounded-lg hover:bg-primary/90 transition-colors">
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
    </div>
  );
};

export default PostPage;
