import { useEffect, useRef, useState } from 'react';

const AUDIO_URL = '/music/birthday.mp3';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLowVolume, setIsLowVolume] = useState(false);
  
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize single audio object pointing to the local S3 / public MP3 resource
  useEffect(() => {
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
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
      
      // Lub (First low-freq pulse)
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
      
      // Dub (Second low-freq pulse)
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

  const startAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : 0.6;
      audio.play().catch(err => console.log("Audio autoplay bypass play failed:", err));
      setIsPlaying(true);
    }
  };

  const fadeOutAll = () => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    const fadeDuration = 2000;
    const steps = 40;
    const stepTime = fadeDuration / steps;
    let currentStep = 0;
    const initialVolume = audio.volume;

    const interval = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;
      audio.volume = Math.max(0, initialVolume * (1 - ratio));

      if (currentStep >= steps) {
        clearInterval(interval);
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
    }, stepTime);
  };

  const dimVolume = () => {
    setIsLowVolume(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : 0.15; // lower volume slightly for the final letter
    }
  };

  const restoreVolume = () => {
    setIsLowVolume(false);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : 0.6; // restore standard volume
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    
    const audio = audioRef.current;
    if (audio) {
      const targetVolume = isLowVolume ? 0.15 : 0.6;
      audio.volume = nextMuted ? 0 : targetVolume;
    }
  };

  return {
    isPlaying,
    isMuted,
    startAudio,
    fadeOutAll,
    dimVolume,
    restoreVolume,
    toggleMute,
    playHeartbeat
  };
};
