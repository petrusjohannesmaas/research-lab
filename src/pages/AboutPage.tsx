import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <main className="pt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-20 flex flex-col lg:flex-row items-stretch gap-12 min-h-[calc(100vh-80px)]">
        {/* Left Column: Content */}
        <div className="lg:w-1/2 flex flex-col justify-center py-12">
          {/* <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-[0.2em] mb-6">
            RESEARCH LAB
          </span> */}
          <h1 className="font-display-lg text-4xl lg:text-5xl font-bold text-on-surface mb-8 leading-tight">
            About This Blog
          </h1>
          <div className="space-y-6 text-on-surface-variant max-w-xl">
            <p className="font-body-lg text-lg leading-relaxed">
              Research Lab is my personal repository for documenting project builds, technical explorations, and engineering workflows.
            </p>
            <p className="font-body-md text-lg leading-relaxed">
              The content here spans from deep-dives into infrastructure automation with <strong>Docker, Kubernetes, and Virtualized environments</strong> to detailed guides on configuring environments for robust, scalable applications.
            </p>
            <p className="font-body-md text-lg leading-relaxed">
              I believe that the best way to master a craft is through documentation and transparency. Every post and guide in this lab is a snapshot of an active project or a researched solution, kept here for my future reference and for anyone else navigating similar technical challenges.
            </p>
            <p className="font-body-md text-lg leading-relaxed">
              Feel free to check out my other projects on my portfolio website & GitHub, where I have showcased some of my client and personal projects
            </p>
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="https://github.com/petrusjohannesmaas"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-4 font-bold text-label-md uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              <i className="fa-brands fa-github text-xl"></i>
              GitHub
            </a>
            <a
              href="https://portfolio.pjmaasdev.workers.dev/#projects"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border-2 border-primary text-primary px-8 py-4 font-bold text-label-md uppercase tracking-widest rounded-xl hover:bg-primary hover:text-on-primary transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xl">work</span>
              Portfolio projects
            </a>
          </div>
        </div>
        {/* Right Column: Image */}
        <div className="lg:w-1/2 h-[400px] lg:h-auto lg:self-center">
          <div className="w-full h-full lg:max-h-[700px] bg-surface-container-high overflow-hidden rounded-2xl shadow-xl">
            <img
              className="w-full h-full object-cover"
              alt="Portrait of a modern software architect in a bright, minimalist workspace"
              src="/about_image.jpg"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
