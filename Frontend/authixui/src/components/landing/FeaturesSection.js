import React from 'react';

const featuresList = [
  { id: 1, title: 'Multi-Tenant System', desc: 'Secure data isolation with custom branding and subdomains for each organization.', icon: '🧩' },
  { id: 2, title: 'Auth & Authorization', desc: 'Robust JWT security, MFA for admins, and Role-Based Access Control.', icon: '🔐' },
  { id: 3, title: 'Tenant Admin Settings', desc: 'Full organizational control, billing analytics, and custom theme management.', icon: '🏢' },
  { id: 4, title: 'Mentor Dashboards', desc: 'Create content, track earnings, schedule sessions, and monitor engagement.', icon: '👨‍🏫' },
  { id: 5, title: 'Student Portals', desc: 'Search marketplace, preview content, and track personal learning progress.', icon: '🎓' },
  { id: 6, title: 'Marketplace System', desc: 'A rich Udemy-style catalog with advanced filtering and seamless access control.', icon: '🛒' },
  { id: 7, title: 'Secure Payments', desc: 'Stripe integration enabling subscriptions and automated 90/10 revenue split payouts.', icon: '💳' },
  { id: 8, title: 'Profile Management', desc: 'Centralized hubs to manage accounts, sessions, timezone, and billing details.', icon: '👤' },
  { id: 9, title: 'Progress Tracking', desc: 'In-depth analytics on completion rates, time spent, and performance metrics.', icon: '📊' },
  { id: 10, title: 'Smart Notifications', desc: 'Real-time WebSocket alerts and email updates for critical platform actions.', icon: '🔔' },
  { id: 11, title: 'Auto-Scaling Infrastructure', desc: 'Disaster recovery, automated backups, and intelligent system monitoring.', icon: '⚙️' },
  { id: 12, title: 'Analytics & Reporting', desc: 'Exportable CSV reports and dynamic dashboards for user and revenue insights.', icon: '📈' },
  { id: 13, title: 'Responsive UI/UX', desc: 'Pixel-perfect mobile & desktop interfaces with elegant Light/Dark mode toggles.', icon: '🎨' },
  { id: 14, title: 'Enterprise Security', desc: 'AES-256 encryption, rate limiting, and strict tenant isolation standards.', icon: '🔒' }
];

function FeaturesSection() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-header">
          <h2>Platform Capabilities</h2>
          <p className="muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to run an enterprise-grade digital academy, built directly into the core code.
          </p>
        </div>

        <div className="features-grid">
          {featuresList.map((feature) => (
            <div key={feature.id} className="glass feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
