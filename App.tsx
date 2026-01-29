import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DemoChat from './components/DemoChat';
import Features from './components/Features';
import Philosophy from './components/Philosophy';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <DemoChat />
        <Features />
        <Philosophy />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default App;