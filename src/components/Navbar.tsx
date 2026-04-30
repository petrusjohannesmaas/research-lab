import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getAllPosts } from '../utils/posts';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const allPosts = useMemo(() => getAllPosts(), []);

  const filteredPosts = useMemo(() => {
    if (!searchValue.trim()) return [];
    const query = searchValue.toLowerCase();
    return allPosts.filter((post: any) => 
      post.title.toLowerCase().includes(query) ||
      post.tags.some((tag: string) => tag.toLowerCase().includes(query))
    ).slice(0, 5); // Limit to top 5 results for dropdown
  }, [searchValue, allPosts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      setIsDropdownOpen(false);
      navigate(`/?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleResultClick = (slug: string) => {
    setIsDropdownOpen(false);
    setSearchValue('');
    navigate(`/post/${slug}`);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-outline-variant/30">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-6 h-20">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-favicon.png" alt="Favicon" className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tighter text-on-surface">
              PJ's Research Lab
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-semibold uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              POSTS
            </NavLink>
            <NavLink
              to="/study-guides"
              className={({ isActive }) =>
                `text-sm font-semibold uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              STUDY GUIDES
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-semibold uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              ABOUT
            </NavLink>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="relative flex items-center" ref={searchRef}>
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-xl">search</span>
            <input
              className="bg-surface-container-low border-none pl-10 pr-4 py-2 text-label-md uppercase tracking-widest focus:ring-1 focus:ring-primary w-48 lg:w-64 transition-all rounded-full"
              placeholder="SEARCH..."
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleSearch}
            />
            
            {/* Live Search Dropdown */}
            {isDropdownOpen && searchValue.trim() && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-outline-variant shadow-xl rounded-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                {filteredPosts.length > 0 ? (
                  <div className="flex flex-col py-2">
                    {filteredPosts.map((post) => (
                      <button
                        key={post.slug}
                        onClick={() => handleResultClick(post.slug)}
                        className="flex flex-col items-start px-4 py-3 hover:bg-surface-container-low transition-colors text-left border-b border-outline-variant/30 last:border-0"
                      >
                        <span className="font-bold text-on-surface text-sm line-clamp-1">{post.title}</span>
                        <div className="flex gap-2 mt-1">
                          {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate(`/?q=${encodeURIComponent(searchValue.trim())}`);
                      }}
                      className="px-4 py-3 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors text-center"
                    >
                      View all results
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center text-on-surface-variant italic text-sm">
                    No matching posts found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button className="md:hidden text-on-surface">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
