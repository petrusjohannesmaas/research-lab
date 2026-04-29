
const CERTS = [
  {
    name: 'Blockchain Specialization',
    issuer: 'University at Buffalo',
    year: '2024',
    logo: '/university_at_buffalo_logo.ico',
    link: 'https://coursera.org/share/8c68df70807921da333312f8c318fc15'
  },
  {
    name: 'Programming With JavaScript',
    issuer: 'Meta',
    year: '2023',
    logo: '/meta_logo.ico',
    link: 'https://www.coursera.org/account/accomplishments/verify/U0RZ745WPSU4'
  },
  {
    name: 'Innovation Through Design',
    issuer: 'University of Sydney',
    year: '2023',
    logo: '/university_of_sydney.ico',
    link: 'https://coursera.org/share/2f9aed491063bafbf7c7b561be2558d3'
  },
  {
    name: 'HTML, CSS and JavaScript for Web Developers',
    issuer: 'John Hopkins University',
    year: '2024',
    logo: '/john_hopkins_logo.ico',
    link: 'https://coursera.org/share/2e666cf3ce8c37ed25facffd8558977f'
  }
];

const INTERESTS = ['Formula 1', 'Linux', 'Privacy', 'Artificial Intelligence', 'Self-reliance', 'World Music', 'Chess', 'Blockchain technology', 'Philosophy'];


export default function About() {
  return (
    <section
      id="about"
      className="py-24 bg-[#f1f5f9] dark:bg-[#0d1f3c]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1d6bf3] mb-2">Who I Am</p>
          <h2 className="font-['Montserrat'] font-extrabold text-4xl sm:text-5xl text-[#0a1628] dark:text-white">
            About Me
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: bio (3 cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-[#0a1628] rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center">
                <i className="fa-solid fa-briefcase text-[#1d6bf3]" style={{ fontSize: '20px' }}></i>
              </div>
              <div className="flex flex-col">
                <span className="font-['Montserrat'] font-bold text-lg text-[#0a1628] dark:text-white">
                  Freelance IT Specialist
                </span>
                <span className="text-sm text-[#475569] dark:text-slate-400">
                  🇿🇦 South Africa · GMT +2
                </span>
              </div>
            </div>

            <p className="text-[#475569] dark:text-slate-400 leading-relaxed mb-4">
              My work spans web development, Linux system administration, infrastructure, automation, and marketing/sales workflows.
              I love bridging the gap between technical complexity and practical business solutions.
            </p>
            <p className="text-[#475569] dark:text-slate-400 leading-relaxed mb-4">
              With a background in both hands-on sysadmin work, blockchain technologies and modern software development using AI tools, I bring
              a practical perspective to every project: I care as much about uptime and security as I do
              about clean code and great UX.
            </p>
            <p className="text-[#475569] dark:text-slate-400 leading-relaxed">
              I'm familiar with CI/CD processes and latest development technologies with a proven record of well documented projects. Explore my blog, or download my CV if you want to learn more.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="https://portfolio.pjmaasdev.workers.dev/#projects"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#1d6bf3] hover:bg-[#1558d6] text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
              >
                <i className="fa-solid fa-id-card"></i>
                View Portfolio
              </a>
              <a
                href="/PJ%20Maas%20CV%20(2026).pdf"
                target="_blank"
                className="inline-flex items-center gap-2 border-2 border-[#1d6bf3] text-[#1d6bf3] hover:bg-[#1d6bf3] hover:text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-[0.98]"
              >
                <i className="fa-solid fa-file-pdf"></i>
                Download CV
              </a>
            </div>
          </div>
          {/* Right: quick facts (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Certificates */}
            <div className="bg-white dark:bg-[#0a1628] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-award text-[#1d6bf3]" style={{ fontSize: '18px' }}></i>
                <h3 className="font-['Montserrat'] font-bold text-[#0a1628] dark:text-white">Certificates</h3>
              </div>
              <ul className="flex flex-col gap-3 flex-1 justify-center">
                {CERTS.map((c) => (
                  <li key={c.name} className="flex items-start gap-3 group">
                    <img
                      src={c.logo}
                      alt={c.issuer}
                      className="w-6 h-6 mt-1 object-contain transition-all"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#0a1628] dark:text-white">{c.name}</p>
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#94a3b8] hover:text-[#1d6bf3] transition-colors"
                          title="View Certificate"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                        </a>
                      </div>
                      <p className="text-xs text-[#64748b] dark:text-slate-400 font-medium">
                        {c.issuer} <span className="text-[#94a3b8] font-normal mx-1">·</span> {c.year}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interests */}
            <div className="bg-white dark:bg-[#0a1628] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-heart text-[#1d6bf3]" style={{ fontSize: '18px' }}></i>
                <h3 className="font-['Montserrat'] font-bold text-[#0a1628] dark:text-white">Interests</h3>
              </div>
              <div className="flex flex-wrap gap-2 flex-1 items-start content-start">
                {INTERESTS.map((i) => (
                  <span
                    key={i}
                    className="bg-[#f1f5f9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
