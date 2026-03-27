import React, { useRef } from 'react';
import SFXManager from './SFXManager';

const ButtonWithSFX = ({ children, onClick, ...props }) => {
  const sfxRef = useRef();

  const handleMouseEnter = () => {
    // Randomly plays hover_soft_1 or hover_soft_2
    sfxRef.current.play('hover');
  };

  const handleClick = (e) => {
    // Randomly plays btn_click_1 or btn_click_2
    sfxRef.current.play('btn_click');
    if (onClick) onClick(e);
  };

  return (
    <>
      <SFXManager ref={sfxRef} />
      <button 
        onMouseEnter={handleMouseEnter} 
        onClick={handleClick}
        className="replit-btn-primary px-6 py-2"
        {...props}
      >
        {children}
      </button>
    </>
  );
};

export default ButtonWithSFX;
