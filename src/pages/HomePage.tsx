import React from 'react';
import { getAllPosts } from '../utils/posts';
import PostCard from '../components/PostCard';
import heroImg from '../assets/hero.png';

const HomePage: React.FC = () => {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-primary-container text-white overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
          <div className="md:col-span-8 flex flex-col justify-center space-y-stack-lg">
            <h1 className="font-display-lg text-display-lg leading-tight">
              Coding Documentation & Projects
            </h1>
            <p className="font-body-lg text-body-lg text-blue-100 max-w-2xl">
              Insights, tutorials, and project logs from a developer perspective. Deep dives into architecture, performance, and clean code.
            </p>
            <div className="pt-stack-md">
              <button className="bg-white text-primary-container px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-surface-container-lowest transition-colors shadow-lg active:scale-95 duration-150">
                Read latest post
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

      {/* All Posts Section */}
      <main className="max-w-[1200px] mx-auto px-6 py-section-gap w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-stack-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">All Posts</h2>
            <div className="w-16 h-1 bg-primary mt-2"></div>
          </div>
          <div className="flex items-center gap-4 bg-surface-container p-2 rounded-xl border border-outline-variant">
            {/* View Toggle */}
            <div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/50">
              <button className="p-2 bg-white text-primary rounded shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined">view_list</span>
              </button>
            </div>
            <div className="h-8 w-px bg-outline-variant"></div>
            {/* Sort Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-on-surface font-label-md text-label-md rounded-lg border border-outline-variant hover:border-primary transition-all group">
              Sort by Date
              <span className="material-symbols-outlined text-[18px] group-hover:translate-y-0.5 transition-transform">arrow_downward</span>
            </button>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
