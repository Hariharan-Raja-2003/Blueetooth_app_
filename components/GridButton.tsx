
import React from 'react';

interface GridButtonProps {
  label: string;
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
}

const GridButton: React.FC<GridButtonProps> = ({ label, onClick, isActive, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 px-2 text-lg font-medium tracking-tight rounded-[2.2rem] transition-all duration-150 active:scale-95
        ${isActive 
          ? 'bg-[#6d5dfc] text-white shadow-[0_0_15px_rgba(109,93,252,0.4)]' 
          : 'bg-[#2d2a37] text-[#c9c6d1] hover:bg-[#3e3b4a]'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        flex items-center justify-center min-h-[70px]
      `}
    >
      {label}
    </button>
  );
};

export default GridButton;
