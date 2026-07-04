import React, { useEffect, useRef } from 'react';

export default function ConfettiCanvas({ burst }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;      // Gravity pull
        p.vx *= p.drag;         // Air friction
        p.vy *= p.drag;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        // Remove off-screen particles or faded particles
        if (p.opacity <= 0 || p.y > h + 30 || p.x < -30 || p.x > w + 30) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        
        if (p.type === 'shred') {
          // Render highly irregular shredded latex rubber pieces
          ctx.beginPath();
          if (p.shape === 'triangle') {
            ctx.moveTo(-p.size / 2, -p.size / 3);
            ctx.lineTo(p.size / 2, -p.size / 2);
            ctx.lineTo(0, p.size / 2);
          } else if (p.shape === 'quad') {
            ctx.moveTo(-p.size / 2, -p.size / 2);
            ctx.lineTo(p.size / 3, -p.size / 2);
            ctx.lineTo(p.size / 2, p.size / 3);
            ctx.lineTo(-p.size / 3, p.size / 2);
          } else {
            // Curvy scrap
            ctx.moveTo(-p.size / 2, -p.size / 4);
            ctx.quadraticCurveTo(0, p.size / 2, p.size / 2, -p.size / 4);
            ctx.lineTo(p.size / 3, p.size / 4);
            ctx.quadraticCurveTo(0, -p.size / 4, -p.size / 3, p.size / 4);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Standard square/circle confetti flutter
          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          }
        }
        ctx.restore();
      }

      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Spawn Pop Explosion
  useEffect(() => {
    if (!burst) return;

    const particles = particlesRef.current;
    const isGold = burst.type === 'gold';
    const balloonColors = burst.colors || ['#EF4444', '#EC4899', '#A855F7'];
    
    // Confetti colors (independent random colors)
    const confettiColors = ['#FF4A82', '#FF9F43', '#FFD200', '#00D2FC', '#4CD137', '#9c27b0', '#e91e63'];

    // 1. Spawn Balloon Rubber Shreds (8-16 pieces)
    const shredCount = isGold ? 24 : Math.floor(Math.random() * 6) + 10; // 10 to 15 shreds
    for (let i = 0; i < shredCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      // High initial velocity for rapid explosion
      const speed = Math.random() * (isGold ? 10 : 7) + (isGold ? 4 : 3);
      const shapes = ['triangle', 'quad', 'curve'];
      
      particles.push({
        type: 'shred',
        x: burst.x,
        y: burst.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 3 + 1.5), // explode outwards & slightly upwards
        size: Math.random() * (isGold ? 13 : 9) + 8, // larger fragments
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 24, // rapid spin
        opacity: 1,
        decay: 0.005, // fades very slowly, mostly falls offscreen
        gravity: 0.28, // heavy rubber gravity pull
        drag: 0.97, // high drag slows them down after initial pop
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        landed: false
      });
    }

    // 2. Spawn Tiny Fluttering Confetti
    const confettiCount = isGold ? 140 : 45;
    for (let i = 0; i < confettiCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      
      particles.push({
        type: 'confetti',
        x: burst.x,
        y: burst.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 2),
        size: Math.random() * 3 + 3.5, // smaller size
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8, // gentle spin
        opacity: 1,
        decay: Math.random() * 0.015 + 0.012, // fades naturally
        gravity: 0.09, // light weight gravity
        drag: 0.94, // floats slowly
        shape: Math.random() > 0.45 ? 'rect' : 'circle',
        landed: false
      });
    }
  }, [burst]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
    />
  );
}
