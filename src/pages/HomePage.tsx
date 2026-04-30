import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllPosts } from '../utils/posts';
import PostCard from '../components/PostCard';
import heroImg from '../assets/hero.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const allPosts = useMemo(() => getAllPosts(), []);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredPosts = useMemo(() => {
    let posts = [...allPosts];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [allPosts, sortOrder, searchQuery]);

  const handleReadLatest = () => {
    if (allPosts.length > 0) {
      navigate(`/post/${allPosts[0].slug}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {!searchQuery && (
        <section className="pt-32 pb-20 bg-primary-container text-white overflow-hidden relative">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
            <div className="md:col-span-8 flex flex-col justify-center space-y-stack-lg">
              <h1 className="font-display-lg text-display-lg leading-tight">
                Coding Documentation & Projects
              </h1>
              <p className="font-body-lg text-body-lg text-blue-100 max-w-2xl">
                Insights, tutorials, and project logs from a developer perspective. Explore my curated study guides covering frontend, backend, DevOps and blockchain technologies.
              </p>
              <div className="pt-stack-md flex items-center gap-4">
                <button
                  onClick={handleReadLatest}
                  className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl transition-all hover:bg-slate-100 active:scale-[0.98]"
                >
                  Read latest post
                </button>
                <button
                  onClick={() => navigate('/study-guides')}
                  className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-6 py-3 rounded-xl transition-all active:scale-[0.98]"
                >
                  View Study Guides
                </button>
              </div>
            </div>
            <div className="hidden md:block md:col-span-4 relative">
              <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full"></div>
              <img
                alt="Clean coding workspace"
                className="rounded-xl shadow-2xl relative z-10 border border-white/10"
                src={heroImg}
              />
            </div>
          </div>
          {/* Subtle grid background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        </section>
      )}

      {/* All Posts Section */}
      <main className={`max-w-[1200px] mx-auto px-6 w-full ${searchQuery ? 'pt-32 pb-section-gap' : 'py-section-gap'}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-stack-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Posts'}
            </h2>
            <div className="w-16 h-1 bg-primary mt-2"></div>
            {searchQuery && (
              <button 
                onClick={() => navigate('/')}
                className="mt-4 text-primary font-bold flex items-center gap-2 hover:underline"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
                Clear Search
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 bg-surface-container p-2 rounded-xl border border-outline-variant">
            {/* View Toggle */}
            <div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded shadow-sm flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              >
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              >
                <span className="material-symbols-outlined">view_list</span>
              </button>
            </div>
            <div className="h-8 w-px bg-outline-variant"></div>
            {/* Sort Button */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-on-surface font-label-md text-label-md rounded-xl border border-outline-variant hover:border-primary transition-all active:scale-[0.98] group"
            >
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              <span className={`material-symbols-outlined text-[18px] transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`}>arrow_downward</span>
            </button>
          </div>
        </div>

        {/* Post Grid/List */}
        {filteredPosts.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {filteredPosts.map((post) => (
              <div key={post.slug} className={viewMode === 'list' ? 'w-full' : ''}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
            <p className="text-xl text-on-surface-variant font-medium">No posts found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
