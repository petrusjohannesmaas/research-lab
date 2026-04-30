import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <main className="pt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-20 flex flex-col lg:flex-row items-stretch gap-12 min-h-[calc(100vh-80px)]">
        {/* Left Column: Content */}
        <div className="lg:w-1/2 flex flex-col justify-center py-12">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-[0.2em] mb-6">
            ABOUT THE BLOG
          </span>
          <h1 className="font-display-lg text-4xl lg:text-5xl font-bold text-on-surface mb-8 leading-tight">
            Architecting Knowledge Through Code
          </h1>
          <div className="space-y-6 text-on-surface-variant max-w-xl">
            <p className="font-body-lg text-lg leading-relaxed">
              Welcome to DevDoc, a specialized technical documentation blog dedicated to the intersection of clean design and robust engineering.
            </p>
            <p className="font-body-md leading-relaxed">
              Here, we dive deep into <strong>project builds</strong>, transforming complex requirements into elegant technical solutions. Whether it's exploring new frameworks or optimizing existing architectures, every post is a step towards better software.
            </p>
            <p className="font-body-md leading-relaxed">
              I share my <strong>personal workflows</strong> for configuring development environments and the <strong>step-by-step guides</strong> I use to maintain consistency across professional projects. This is more than just a blog; it's a living archive of technical mastery.
            </p>
          </div>
          <div className="mt-12">
            <a
              href="https://portfolio.pjmaasdev.workers.dev/#projects"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-on-surface text-surface px-10 py-4 font-bold text-label-md uppercase tracking-widest hover:bg-on-surface-variant transition-colors"
            >
              My portfolio
            </a>
          </div>
        </div>
        {/* Right Column: Image */}
        <div className="lg:w-1/2 h-[500px] lg:h-auto">
          <div className="w-full h-full bg-surface-container-high overflow-hidden">
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
