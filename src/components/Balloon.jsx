import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const BALLOON_COLORS = [
  { name: 'Red', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #E63946 100%)', knot: '#E63946', colors: ['#FF6B6B', '#E63946', '#C92A2A'] },
  { name: 'Pink', gradient: 'linear-gradient(135deg, #FF85A2 0%, #D81B60 100%)', knot: '#D81B60', colors: ['#FF85A2', '#D81B60', '#A61B4A'] },
  { name: 'Purple', gradient: 'linear-gradient(135deg, #B19FFB 0%, #6A1B9A 100%)', knot: '#6A1B9A', colors: ['#B19FFB', '#6A1B9A', '#4A148C'] },
  { name: 'Blue', gradient: 'linear-gradient(135deg, #74C0FC 0%, #1971C2 100%)', knot: '#1971C2', colors: ['#74C0FC', '#1971C2', '#0B3C5D'] },
  { name: 'Green', gradient: 'linear-gradient(135deg, #8CE99A 0%, #2B8A3E 100%)', knot: '#2B8A3E', colors: ['#8CE99A', '#2B8A3E', '#1B5E20'] },
  { name: 'Yellow', gradient: 'linear-gradient(135deg, #FFE066 0%, #EAB308 100%)', knot: '#EAB308', colors: ['#FFE066', '#EAB308', '#9E7807'] },
  { name: 'Orange', gradient: 'linear-gradient(135deg, #FF922B 0%, #D9480F 100%)', knot: '#D9480F', colors: ['#FF922B', '#D9480F', '#8C3005'] }
];

export default function Balloon({ number, onPop, onEscaped }) {
  const isGold = number === 22;
  const [isStretching, setIsStretching] = React.useState(false);

  // Pick a random color configuration for standard balloons
  const colorConfig = useMemo(() => {
    if (isGold) {
      return {
        name: 'Gold',
        gradient: 'linear-gradient(135deg, #FFE082 0%, #F59E0B 50%, #B45309 100%)',
        knot: '#F59E0B',
        colors: ['#FFE082', '#F59E0B', '#B45309', '#78350F']
      };
    }
    return BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  }, [number, isGold]);

  // Handle tap interaction
  const handleTap = (e) => {
    e.stopPropagation();
    if (isStretching) return; // prevent double taps
    
    setIsStretching(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
    
    // Map coordinate space relative to the centered canvas parent container
    const x = (rect.left + rect.width / 2) - parentRect.left;
    const y = (rect.top + rect.height / 2) - parentRect.top;

    // Wait 85ms for the stretch visual to complete before bursting
    setTimeout(() => {
      onPop(x, y, colorConfig);
    }, 85);
  };

  return (
    <motion.div
      initial={{ y: '105vh', x: 0 }}
      animate={{
        y: '10vh',
        x: [-28, 28, -28],
        rotate: [-5, 5, -5]
      }}
      transition={{
        y: { duration: isGold ? 8.2 : 5.4, ease: "easeOut" },
        x: { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
        rotate: { repeat: Infinity, duration: 3.2, ease: "easeInOut" }
      }}
      onPointerDown={handleTap}
      className="absolute left-1/2 -translate-x-1/2 z-20 cursor-pointer select-none origin-bottom touch-none"
      style={{
        width: isGold ? '100px' : '78px',
        height: isGold ? '125px' : '98px',
      }}
    >
      
      {/* Balloon Shape - handles squash/stretch */}
      <motion.div 
        animate={isStretching ? {
          scaleX: 1.25,
          scaleY: 0.80,
        } : {
          scaleX: 1.0,
          scaleY: 1.0,
        }}
        transition={{
          duration: 0.08,
          ease: "easeOut"
        }}
        className={`w-full h-full rounded-t-[50%_46%] rounded-b-[50%_54%] relative shadow-[inset_-8px_-12px_20px_rgba(0,0,0,0.15)] ${
          isGold ? 'shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-yellow-300/30' : ''
        }`}
        style={{ background: colorConfig.gradient }}
      >
        {/* Shine highlight */}
        <div className="absolute top-[10%] left-[15%] w-[18%] h-[25%] bg-white/25 rounded-full rotate-[-30deg]" />

        {/* Bottom Knot */}
        <div 
          className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3.5 h-2.5"
          style={{
            borderBottom: `6px solid ${colorConfig.knot}`,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
          }}
        />
      </motion.div>

      {/* Swaying String */}
      <svg 
        className="absolute top-[100%] left-1/2 -translate-x-1/2 overflow-visible pointer-events-none" 
        width="20" 
        height="85"
      >
        <motion.path 
          d="M 10,0 Q 5,22 15,44 T 10,85" 
          fill="none" 
          stroke="rgba(255,255,255,0.35)" 
          strokeWidth="1.2"
          animate={{ d: ["M 10,0 Q 5,22 15,44 T 10,85", "M 10,0 Q 15,22 5,44 T 10,85", "M 10,0 Q 5,22 15,44 T 10,85"] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        />
      </svg>

    </motion.div>
  );
}
