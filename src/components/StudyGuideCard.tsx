import React from 'react';
import { Link } from 'react-router-dom';
import type { StudyGuide } from '../data/studyGuides';

interface StudyGuideCardProps {
  guide: StudyGuide;
}

const StudyGuideCard: React.FC<StudyGuideCardProps> = ({ guide }) => {
  return (
    <Link 
      to={`/study-guides/${guide.id}`}
      className="flex flex-col bg-white border border-outline-variant rounded-2xl overflow-hidden hover:border-primary hover:shadow-lg transition-all group duration-300 transform hover:-translate-y-1"
    >
      <div className="p-8 pb-6 flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <span className="material-symbols-outlined text-[28px]">{guide.icon}</span>
        </div>
        <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
          {guide.category}
        </span>
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <h3 className="font-display text-2xl font-bold text-on-surface mb-4 group-hover:text-primary transition-colors">
          {guide.title}
        </h3>
        <p className="font-body text-on-surface-variant leading-relaxed mb-8 flex-grow">
          {guide.description}
        </p>
        
        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
          <span>Explore Guide</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </div>
      </div>
    </Link>
  );
};

export default StudyGuideCard;
