import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// Audio imports from src/audio/
import btnClick1 from '../audio/btn_click_1.mp3';
import btnClick2 from '../audio/btn_click_2.mp3';
import btnToggle from '../audio/btn_toggle.mp3';
import hoverSoft1 from '../audio/hover_soft_1.mp3';
import hoverSoft2 from '../audio/hover_soft_2.mp3';
import successPing1 from '../audio/success_ping_1.mp3';
import successPing2 from '../audio/success_ping_2.mp3';
import errorBuzz1 from '../audio/error_buzz_1.mp3';
import ambientBackground from '../audio/ambient_background.mp3';

/**
 * SFXManager Component
 * Fully integrated audio system for the CODIFY Studio dashboard.
 * 
 * Usage:
 * const sfxRef = useRef();
 * <SFXManager ref={sfxRef} />
 * sfxRef.current.play('btn_click_1');
 */
const SFXManager = forwardRef((props, ref) => {
  // Use useRef to store Audio objects as requested
  const sounds = useRef({
    btn_click_1: new Audio(btnClick1),
    btn_click_2: new Audio(btnClick2),
    btn_toggle: new Audio(btnToggle),
    hover_soft_1: new Audio(hoverSoft1),
    hover_soft_2: new Audio(hoverSoft2),
    success_ping_1: new Audio(successPing1),
    success_ping_2: new Audio(successPing2),
    error_buzz_1: new Audio(errorBuzz1),
    ambient_background: new Audio(ambientBackground),
  });

  const isMuted = useRef(false);
  const globalVolume = useRef(0.2);

  useEffect(() => {
    // Setup initial volumes
    Object.keys(sounds.current).forEach(key => {
      const audio = sounds.current[key];
      if (key === 'ambient_background') {
        audio.volume = 0.08; // Ambient range 0.05-0.1
        audio.loop = true;
        // Start ambient on load
        audio.play().catch(e => console.log("Autoplay blocked. User interaction required."));
      } else {
        audio.volume = globalVolume.current;
      }
    });

    return () => {
      // Cleanup: stop all sounds on unmount
      Object.values(sounds.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // Expose play function to parent components
  useImperativeHandle(ref, () => ({
    play: (soundName, volume = null) => {
      if (isMuted.current) return;

      const sound = sounds.current[soundName];
      if (sound) {
        // Handle random choices for specific types
        let actualSound = sound;
        
        if (soundName === 'btn_click') {
          actualSound = Math.random() > 0.5 ? sounds.current.btn_click_1 : sounds.current.btn_click_2;
        } else if (soundName === 'hover') {
          actualSound = Math.random() > 0.5 ? sounds.current.hover_soft_1 : sounds.current.hover_soft_2;
        } else if (soundName === 'success') {
          actualSound = Math.random() > 0.5 ? sounds.current.success_ping_1 : sounds.current.success_ping_2;
        }

        // Play logic
        actualSound.currentTime = 0; // Ensure it starts at 0s
        if (volume !== null) actualSound.volume = volume;
        actualSound.play().catch(err => console.error("SFX Play Error:", err));
      }
    },
    toggleMute: () => {
      isMuted.current = !isMuted.current;
      if (isMuted.current) {
        sounds.current.ambient_background.pause();
      } else {
        sounds.current.ambient_background.play();
      }
      return isMuted.current;
    },
    setVolume: (vol) => {
      globalVolume.current = vol;
      Object.keys(sounds.current).forEach(key => {
        if (key !== 'ambient_background') {
          sounds.current[key].volume = vol;
        }
      });
    }
  }));

  return null; // This component doesn't render any UI
});

export default SFXManager;
