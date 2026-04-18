import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DemoChat from './components/DemoChat';
import Features from './components/Features';
import Philosophy from './components/Philosophy';
import Footer from './components/Footer';
import Mission from './components/Mission';

const Home: React.FC = () => (
  <main>
    <Hero />
    <DemoChat />
    <Features />
    <Philosophy />
  </main>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mission" element={<Mission />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;