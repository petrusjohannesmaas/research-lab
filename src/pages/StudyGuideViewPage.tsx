import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { studyGuides } from '../data/studyGuides';

const StudyGuideViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const guide = useMemo(() => studyGuides.find(g => g.id === id), [id]);

  if (!guide) {
    return <Navigate to="/study-guides" replace />;
  }

  const formattedJSON = JSON.stringify({ study_plan: guide.studyPlan }, null, 2);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-primary-container text-white pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">{guide.category}</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 tracking-tight">{guide.title}</h1>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
            {guide.description}
          </p>
        </div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-12">
            <section className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm">
              <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-primary text-3xl">info</span>
                Overview
              </h2>
              <div className="space-y-4 text-on-surface-variant leading-relaxed text-lg">
                {guide.overview.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-outline-variant/50">
                  {guide.specs.map((spec, index) => (
                    <div key={index}>
                      <span className="block text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">{spec.label}</span>
                      <span className="font-semibold text-on-surface">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-headline flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-primary text-3xl">school</span>
                  Study Guide
                </h2>
                <span className="bg-surface-container px-3 py-1 rounded text-xs font-mono text-primary font-bold">JSON FORMAT</span>
              </div>
              <div className="relative group">
                 <pre className="bg-[#0f172a] text-blue-400 p-8 rounded-2xl overflow-x-auto text-sm leading-relaxed shadow-inner border border-white/5">
                   <code>{formattedJSON}</code>
                 </pre>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm sticky top-24">
              <h3 className="font-bold font-headline mb-6 text-xl">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/study-guides" className="flex items-center gap-3 p-4 rounded-xl bg-surface hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group">
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">arrow_back</span>
                    <span className="font-semibold text-on-surface">All Study Guides</span>
                  </Link>
                </li>
              </ul>

              <div className="mt-12 pt-8 border-t border-outline-variant/50">
                <h4 className="font-bold font-headline mb-4 text-sm uppercase tracking-widest text-on-surface-variant">Author</h4>
                <div className="flex items-center gap-4">
                  <img src="/avatar.png" alt="PJ Maas" className="w-12 h-12 rounded-full object-cover border border-outline-variant" />
                  <div>
                    <p className="font-bold text-on-surface">PJ Maas</p>
                    <p className="text-xs text-on-surface-variant">Technical Lead</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      
      {/* Footer Nav */}
      <footer className="border-t border-outline-variant bg-white py-20 mt-auto">
        <div className="max-w-[1200px] mx-auto px-6">
          <h3 className="font-bold font-display text-3xl mb-12 text-center text-on-surface">Explore Other Guides</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {studyGuides.filter(g => g.id !== guide.id).map(otherGuide => (
              <Link 
                key={otherGuide.id}
                to={`/study-guides/${otherGuide.id}`} 
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface border border-outline-variant hover:border-primary hover:shadow-lg transition-all group w-32"
              >
                <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">{otherGuide.icon}</span>
                <span className="font-bold text-sm text-center">{otherGuide.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudyGuideViewPage;
