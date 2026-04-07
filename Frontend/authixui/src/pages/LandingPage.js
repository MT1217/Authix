import React, { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import Footer from '../components/landing/Footer';

function LandingPage() {
  useEffect(() => {
    // Set document title to Authix Platform
    document.title = "Authix | Multi-Tenant Mentorship SaaS";
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
