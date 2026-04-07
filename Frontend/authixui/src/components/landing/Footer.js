import React from 'react';
import Button from '../ui/Button';

function Footer() {
  return (
    <>
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-container">
            <div className="contact-info">
              <h2>Let's build something extraordinary together.</h2>
              <p className="muted">
                Have questions about our enterprise plans, need custom integrations, or want to say hello? Our team is available 24/7.
              </p>
              
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>📧</span>
                  <span>enterprise@authix.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>🏢</span>
                  <span>101 Innovation Drive, Tech City TS 54321</span>
                </div>
              </div>
            </div>
            
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Jane Doe" required />
              </div>
              <div className="form-group">
                <label>Company Email</label>
                <input type="email" placeholder="jane@company.com" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows="4" placeholder="How can we help you?" required></textarea>
              </div>
              <Button style={{ marginTop: '16px' }} type="submit">Send Message</Button>
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h2>Authix.</h2>
              <p>The ultimate multi-tenant mentorship platform. Empowering creators and institutions globally.</p>
              <div className="social-links">
                <a href="#twitter" className="social-link" title="Twitter">𝕏</a>
                <a href="#github" className="social-link" title="GitHub">🐙</a>
                <a href="#linkedin" className="social-link" title="LinkedIn">💼</a>
                <a href="#discord" className="social-link" title="Discord">💬</a>
              </div>
            </div>
            
            <div className="footer-links">
              <h4>Platform</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#marketplace">Marketplace</a></li>
                <li><a href="#enterprise">Enterprise</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>Resources</h4>
              <ul>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#api">API Reference</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#guides">Mentorship Guides</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#privacy">Privacy & Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Authix Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
