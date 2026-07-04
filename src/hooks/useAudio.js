import { useEffect, useRef, useState } from 'react';

const TRACK_URLS = [
  'https://assets.mixkit.co/music/preview/mixkit-serene-view-1215.mp3', // Intro & Timeline (Drone)
  'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3',   // Memories 1-2 (Piano)
  'https://assets.mixkit.co/music/preview/mixkit-tender-love-1214.mp3',   // Memories 3-4 (Acoustic)
  'https://assets.mixkit.co/music/preview/mixkit-forest-flute-1218.mp3'   // Final Letter (Strings)
];

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  
  const audiosRef = useRef([]);
  const audioContextRef = useRef(null);
  const fadeIntervalsRef = useRef([]);
  
  // Initialize audios
  useEffect(() => {
    audiosRef.current = TRACK_URLS.map(url => {
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = 0;
      audio.crossOrigin = "anonymous";
      return audio;
    });
    
    return () => {
      audiosRef.current.forEach(audio => {
        audio.pause();
      });
      fadeIntervalsRef.current.forEach(clearInterval);
    };
  }, []);

  const playHeartbeat = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const now = ctx.currentTime;
      
      // Lub (First lower pulse)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 0.15);
      
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.8, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);
      
      // Dub (Second slightly higher pulse)
      const delay = 0.16;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(50, now + delay);
      osc2.frequency.exponentialRampToValueAtTime(28, now + delay + 0.2);
      
      gain2.gain.setValueAtTime(0, now + delay);
      gain2.gain.linearRampToValueAtTime(0.6, now + delay + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2);
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + delay);
      osc2.stop(now + delay + 0.2);
    } catch (e) {
      console.warn("Heartbeat synthesis error:", e);
    }
  };

  const startAudio = (trackIndex = 0) => {
    // Resume context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Play the specified track
    const targetAudio = audiosRef.current[trackIndex];
    if (targetAudio) {
      targetAudio.volume = isMuted ? 0 : 0.6;
      targetAudio.play().catch(err => console.log("Audio play failed:", err));
      setCurrentTrackIndex(trackIndex);
      setIsPlaying(true);
    }
  };

  const crossfadeTo = (targetIndex) => {
    if (targetIndex === currentTrackIndex) return;
    if (targetIndex < 0 || targetIndex >= TRACK_URLS.length) return;
    
    const prevIndex = currentTrackIndex;
    setCurrentTrackIndex(targetIndex);
    
    const prevAudio = audiosRef.current[prevIndex];
    const nextAudio = audiosRef.current[targetIndex];
    
    if (!nextAudio) return;
    
    // Start playing next audio at 0 volume
    nextAudio.volume = 0;
    nextAudio.play().catch(err => console.log("Next track play failed:", err));
    
    // Clear any existing fades
    fadeIntervalsRef.current.forEach(clearInterval);
    fadeIntervalsRef.current = [];
    
    const fadeDuration = 1500; // 1.5s
    const steps = 30;
    const stepTime = fadeDuration / steps;
    let currentStep = 0;
    
    const targetVolume = isMuted ? 0 : 0.6;
    const initialPrevVolume = prevAudio ? prevAudio.volume : 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;
      
      if (prevAudio) {
        prevAudio.volume = Math.max(0, initialPrevVolume * (1 - ratio));
      }
      nextAudio.volume = Math.min(targetVolume, ratio * targetVolume);
      
      if (currentStep >= steps) {
        clearInterval(interval);
        if (prevAudio) {
          prevAudio.pause();
          prevAudio.currentTime = 0;
        }
        nextAudio.volume = targetVolume;
      }
    }, stepTime);
    
    fadeIntervalsRef.current.push(interval);
  };

  const fadeOutAll = () => {
    fadeIntervalsRef.current.forEach(clearInterval);
    fadeIntervalsRef.current = [];
    
    const fadeDuration = 2000; // 2s
    const steps = 40;
    const stepTime = fadeDuration / steps;
    let currentStep = 0;
    
    const activeAudios = audiosRef.current.filter(a => !a.paused);
    const initialVolumes = activeAudios.map(a => a.volume);
    
    const interval = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;
      
      activeAudios.forEach((audio, idx) => {
        audio.volume = Math.max(0, initialVolumes[idx] * (1 - ratio));
      });
      
      if (currentStep >= steps) {
        clearInterval(interval);
        activeAudios.forEach(audio => {
          audio.pause();
          audio.currentTime = 0;
        });
        setIsPlaying(false);
      }
    }, stepTime);
    
    fadeIntervalsRef.current.push(interval);
  };

  const dimVolume = () => {
    const activeAudio = audiosRef.current[currentTrackIndex];
    if (activeAudio) {
      activeAudio.volume = isMuted ? 0 : 0.18;
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    
    const activeAudio = audiosRef.current[currentTrackIndex];
    if (activeAudio) {
      activeAudio.volume = nextMuted ? 0 : 0.6;
    }
  };

  return {
    isPlaying,
    isMuted,
    currentTrackIndex,
    startAudio,
    crossfadeTo,
    fadeOutAll,
    dimVolume,
    toggleMute,
    playHeartbeat
  };
};
