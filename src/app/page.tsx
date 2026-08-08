import Head from 'next/head';
import DigitalTwinChat from '@/components/DigitalTwinChat';


export default function Home() {
  return (
    <>
      <main className="container">
        
        {/* Hero Section */}
        <section className="section hero animate-fade-in delay-1">
          <h1 className="title-main">
            Nazmul Hasan <br />
            <span className="text-gradient">Peeal</span>
          </h1>
          <p className="subtitle">
            Business Analyst & Former Web Developer. Bridging technical expertise with human-centric solutions.
          </p>
          <div className="skills-container" style={{ marginBottom: '2rem' }}>
            <a href="mailto:piyal01713@gmail.com" className="btn btn-primary">Let's Connect</a>
            <a href="#experience" className="btn btn-secondary">View Journey</a>
          </div>
        </section>

        {/* About Me Section */}
        <section id="about" className="section animate-fade-in delay-2">
          <h2 className="section-title">About Me</h2>
          <div className="glass-card">
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              After earning my bachelor's degree in Software Engineering, I spent over two years as a freelance web developer, honing my technical skills and delivering high-quality solutions. While coding was rewarding, my passion for client interactions inspired me to focus on enhancing my soft skills.
            </p>
            <br />
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              Driven by a deep interest in psychology, I am now eager to combine my technical expertise with my enthusiasm for people in roles such as business analysis, marketing, or sales. I aim to leverage my skills to foster strong client relationships and contribute to the success of an organization.
            </p>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="section animate-fade-in delay-3">
          <h2 className="section-title">Career Journey</h2>
          <div className="timeline">
            
            <div className="timeline-item">
              <span className="timeline-date">Dec 2023 - Present</span>
              <h3 className="timeline-title">Business Analyst</h3>
              <p className="timeline-subtitle">SELISE Digital Platforms, a Swiss Company</p>
              <div className="glass-card">
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>Managed and interacted directly with clients in Switzerland.</li>
                  <li>Managed the development team effectively.</li>
                  <li>Fulfilled the role of product manager in system development using Agile methodology.</li>
                </ul>
              </div>
            </div>

            <div className="timeline-item">
              <span className="timeline-date">Oct 2022 - Nov 2023</span>
              <h3 className="timeline-title">In-house Programmer</h3>
              <p className="timeline-subtitle">UCSI University Bangladesh Campus</p>
              <div className="glass-card">
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>Maintained the university website using Drupal CMS.</li>
                  <li>Communicated with clients in Malaysia to align website management with base campus practices.</li>
                </ul>
              </div>
            </div>

            <div className="timeline-item">
              <span className="timeline-date">Apr 2020 - Jun 2022</span>
              <h3 className="timeline-title">Market Researcher & Facebook Marketer</h3>
              <p className="timeline-subtitle">Dynamic Agro Tech Company</p>
              <div className="glass-card">
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>Sourced clients online for the import and export of spices.</li>
                  <li>Promoted a Facebook page selling avocado oil locally.</li>
                </ul>
              </div>
            </div>

            <div className="timeline-item">
              <span className="timeline-date">Feb 2016 - May 2016</span>
              <h3 className="timeline-title">In-house Programmer</h3>
              <p className="timeline-subtitle">Pocket Pixel Sdn. Bhd, Kuala Lumpur, Malaysia</p>
              <div className="glass-card">
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>Programmed in PHP to develop functions for a new web-app.</li>
                  <li>Generated new UI ideas for the web-app.</li>
                  <li>Maintained two client websites using Content Management Systems.</li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* Skills & Education Section */}
        <section id="skills-education" className="section animate-fade-in delay-3">
          <div className="grid-2">
            
            {/* Skills */}
            <div>
              <h2 className="section-title">Technical Expertise</h2>
              <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Core Skills</h4>
                <div className="skills-container" style={{ marginBottom: '1.5rem' }}>
                  <span className="skill-tag">HTML</span>
                  <span className="skill-tag">CSS</span>
                  <span className="skill-tag">JavaScript</span>
                  <span className="skill-tag">MySQL</span>
                  <span className="skill-tag">PHP</span>
                  <span className="skill-tag">C++</span>
                </div>
                
                <h4 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Software & Tools</h4>
                <div className="skills-container">
                  <span className="skill-tag">JIRA</span>
                  <span className="skill-tag">Confluence</span>
                  <span className="skill-tag">SAP Software</span>
                  <span className="skill-tag">Microsoft Office / G Suite</span>
                  <span className="skill-tag">Facebook Advertising</span>
                </div>
              </div>
              
              <h2 className="section-title" style={{ marginTop: '3rem' }}>Languages</h2>
              <div className="glass-card">
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
                  <li><strong>Bangla:</strong> Native proficiency</li>
                  <li><strong>English:</strong> Full professional proficiency</li>
                </ul>
              </div>
            </div>

            {/* Education & Associations */}
            <div>
              <h2 className="section-title">Education</h2>
              <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>Masters in Software Eng. and System Architecture</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Multimedia University, Cyberjaya, Malaysia (2016 - 2019)</p>
                  <p style={{ fontSize: '0.9rem' }}>Completed 100 credits</p>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>Bachelor of Computer Science (Software Eng.)</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Multimedia University, Cyberjaya, Malaysia (2011 - 2016)</p>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>A-Level (Edexcel)</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Cephalon International School, Dhaka (2009 - 2010)</p>
                  <p style={{ fontSize: '0.9rem' }}>A’s in four subjects</p>
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>O-Level (Edexcel)</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sunshine Grammar School, Chittagong (2007)</p>
                  <p style={{ fontSize: '0.9rem' }}>A’s in 7 subjects</p>
                </div>
              </div>

              <h2 className="section-title" style={{ marginTop: '3rem' }}>Associations</h2>
              <div className="glass-card">
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
                  <li><strong>Red Crescent Malaysia</strong> (2014-2015)</li>
                  <li><strong>Kyokushin Karate</strong> (2007-2009)</li>
                  <li><strong>Daily Star Award</strong> - O and A Level Results</li>
                </ul>
              </div>
            </div>

          </div>
        </section>

      </main>
      
      <footer>
        <div className="container">
          <p>© {new Date().getFullYear()} Nazmul Hasan Peeal. All rights reserved.</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>+8801713103700 | piyal01713@gmail.com | Dhaka, Bangladesh</p>
        </div>
      </footer>
      <DigitalTwinChat />
    </>
  );
}
