import React, { useEffect, useRef } from 'react';

export default function InteractiveCanvas({ type, className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let ripples = [];
    let shootingStars = [];
    let mouse = { x: -1000, y: -1000, radius: 100 };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      if (type === 'stars') {
        const count = 60;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            active: false
          });
        }
      } else if (type === 'cafe' || type === 'beach') {
        const count = 30;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -Math.random() * 0.4 - 0.1,
            alpha: Math.random() * 0.5 + 0.1,
            hue: type === 'beach' ? 35 : 25 // warm rose-gold / orange particles
          });
        }
      }
    };

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      if (type === 'stars') {
        // Spawn occasional shooting stars
        if (shootingStars.length < 1 && Math.random() < 0.003) {
          shootingStars.push({
            x: Math.random() * width * 0.6,
            y: Math.random() * height * 0.3,
            dx: Math.random() * 4 + 3,
            dy: Math.random() * 2.5 + 2,
            opacity: 1.0,
            fadeSpeed: Math.random() * 0.015 + 0.01
          });
        }

        // Draw and update active shooting stars
        shootingStars.forEach((ss, idx) => {
          ctx.beginPath();
          const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.dx * 6, ss.y - ss.dy * 6);
          grad.addColorStop(0, `rgba(229, 193, 179, ${ss.opacity})`);
          grad.addColorStop(1, `rgba(229, 193, 179, 0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.moveTo(ss.x, ss.y);
          ctx.lineTo(ss.x - ss.dx * 5, ss.y - ss.dy * 5);
          ctx.stroke();

          // Move
          ss.x += ss.dx;
          ss.y += ss.dy;
          ss.opacity -= ss.fadeSpeed;

          // Remove if faded or offscreen
          if (ss.opacity <= 0 || ss.x > width || ss.y > height) {
            shootingStars.splice(idx, 1);
          }
        });

        particles.forEach(p => {
          // Adjust twinkle speed based on mouse distance
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let speed = p.twinkleSpeed;
          let size = p.size;
          
          if (dist < mouse.radius) {
            speed *= 6;
            size *= 1.4;
          }

          p.alpha += speed;
          if (p.alpha > 1 || p.alpha < 0.1) {
            p.twinkleSpeed = -p.twinkleSpeed;
          }
          
          // Clamp alpha
          p.alpha = Math.max(0.1, Math.min(1, p.alpha));

          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(243, 244, 246, ${p.alpha})`;
          ctx.fill();
        });
      } 
      
      else if (type === 'rain') {
        // Draw ripples
        ripples.forEach((r, idx) => {
          r.radius += 1.5;
          r.alpha -= 0.015;

          if (r.alpha <= 0) {
            ripples.splice(idx, 1);
            return;
          }

          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(159, 122, 234, ${r.alpha})`; // purple tint ripples
          ctx.lineWidth = 1;
          ctx.stroke();

          // Outer secondary ripple
          ctx.beginPath();
          ctx.arc(r.x, r.y, Math.max(0, r.radius - 15), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(229, 193, 179, ${r.alpha * 0.4})`; // rose gold outer tint
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });
      } 
      
      else if (type === 'cafe' || type === 'beach') {
        particles.forEach(p => {
          // Move particles upwards
          p.y += p.vy;
          p.x += p.vx;

          // Push particles slightly away from mouse
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += (dx / dist) * force * 2;
            p.y += (dy / dist) * force * 2;
          }

          // Wrap around screen
          if (p.y < 0) p.y = height;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 70%, 80%, ${p.alpha})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = `hsla(${p.hue}, 70%, 80%, 0.5)`;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Event Handlers
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      if (type === 'rain' && Math.random() < 0.15) {
        ripples.push({
          x: mouse.x,
          y: mouse.y,
          radius: 2,
          alpha: 0.8
        });
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;

        if (type === 'rain' && Math.random() < 0.25) {
          ripples.push({
            x: mouse.x,
            y: mouse.y,
            radius: 2,
            alpha: 0.8
          });
        }
      }
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (type === 'rain') {
        ripples.push({ x: clickX, y: clickY, radius: 2, alpha: 0.9 });
        ripples.push({ x: clickX, y: clickY, radius: 10, alpha: 0.6 });
      } else if (type === 'stars') {
        // Spawn a temporary shooting star/glow burst
        for (let i = 0; i < 5; i++) {
          particles.push({
            x: clickX,
            y: clickY,
            size: Math.random() * 2 + 1,
            alpha: 1,
            twinkleSpeed: -(Math.random() * 0.05 + 0.02),
            active: true
          });
        }
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Attach listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Init and run
    handleResize();
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className || "absolute inset-0 w-full h-full pointer-events-auto z-20"} 
    />
  );
}
