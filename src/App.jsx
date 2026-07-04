import React, { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import IntroContainer from './components/IntroContainer';
import Timeline from './components/Timeline';
import MemoryCard from './components/MemoryCard';
import FinalLetter from './components/FinalLetter';
import EndingScene from './components/EndingScene';
import MusicPlayer from './components/MusicPlayer';
import { memories } from './data/memories';

function App() {
  const [started, setStarted] = useState(false);
  const [letterCompleted, setLetterCompleted] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  // Scroll to top on refresh/load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBegin = () => {
    setStarted(true);
  };

  const handleLetterComplete = () => {
    setLetterCompleted(true);
  };

  const handleActiveSection = (section) => {
    if (!started) return;
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-dark-obsidian flex items-center justify-center font-sans overflow-x-hidden relative">
      
      {/* Background radial glowing ambient lights on desktop */}
      <div className="hidden md:block absolute top-[15%] left-[20%] w-[350px] h-[350px] bg-purple-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Primary Mobile Container (390px responsive column) */}
      <div className="w-full max-w-[390px] min-h-screen bg-[#050506] shadow-2xl relative flex flex-col justify-start overflow-hidden border-x border-white/5">
        
        {/* Declarative Floating Sound Controller */}
        <MusicPlayer 
          isLowVolume={activeSection === 'letter'} 
          fadeOut={letterCompleted} 
        />

        {/* 1. Intro Screen */}
        {!started && (
          <IntroContainer 
            onComplete={handleBegin} 
          />
        )}

        {/* 2. Interactive Scrollable Story Timeline & Memories */}
        {started && !letterCompleted && (
          <ReactLenis root>
            <div className="w-full flex flex-col justify-start">
              
              {/* Introduction Timeline */}
              <motion.div
                onViewportEnter={() => handleActiveSection('timeline')}
                viewport={{ amount: 0.15 }}
              >
                <Timeline />
              </motion.div>

              {/* Memory Cards */}
              {memories.map((memory, idx) => (
                <MemoryCard 
                  key={memory.id} 
                  {...memory} 
                  onActive={() => handleActiveSection('memory')} 
                />
              ))}

              {/* Spacing void between memories and final letter */}
              <div className="h-[35vh] bg-dark-obsidian relative flex items-center justify-center pointer-events-none">
                <div className="w-[1px] h-24 bg-gradient-to-b from-white/10 to-transparent" />
              </div>

              {/* Envelope and Letter Section */}
              <motion.div
                onViewportEnter={() => handleActiveSection('letter')}
                viewport={{ amount: 0.25 }}
              >
                <FinalLetter onComplete={handleLetterComplete} />
              </motion.div>
            </div>
          </ReactLenis>
        )}

        {/* 3. Ending Heartbeat Scene */}
        {letterCompleted && (
          <EndingScene />
        )}

      </div>
    </div>
  );
}

// Framer motion animation hooks
import { motion } from 'framer-motion';

export default App;
