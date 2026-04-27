import React from 'react';
import { studyGuides } from '../data/studyGuides';
import StudyGuideCard from '../components/StudyGuideCard';

const StudyGuidesLandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-primary-container text-white pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Learning Resources</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 tracking-tight">Study Guides</h1>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
            Curated documentation and roadmaps for mastering various technologies, from frontend development to DevOps and blockchain.
          </p>
        </div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </header>

      {/* Grid Section */}
      <main className="max-w-[1200px] mx-auto px-6 py-20 w-full flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studyGuides.map(guide => (
            <StudyGuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudyGuidesLandingPage;
