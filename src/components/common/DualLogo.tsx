import React from 'react';
import { MSSNLogo } from './MSSNLogo';
import { FUDLogo } from './FUDLogo';

interface DualLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'emerald';
  showTogether?: boolean;
}

export const DualLogo: React.FC<DualLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTogether = true
}) => {
  const pixelSize = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;

  return (
    <div className="flex items-center gap-1.5 shrink-0 select-none">
      {/* MSSN Official Logo */}
      <div className="relative transform transition-transform duration-200 hover:scale-105">
        <div className="p-0.5 rounded-full bg-white shadow-xs border border-[#E8E4DB] flex items-center justify-center">
          <MSSNLogo size={pixelSize} />
        </div>
      </div>

      {showTogether && (
        <>
          {/* Subtle separator or emblem bridge */}
          <div className="flex flex-col items-center justify-center opacity-60">
            <span className="text-[10px] text-[#C29A5B] font-bold">×</span>
          </div>

          {/* FUD Official University Logo */}
          <div className="relative transform transition-transform duration-200 hover:scale-105">
            <div className="p-0.5 rounded-full bg-white shadow-xs border border-[#E8E4DB] flex items-center justify-center">
              <FUDLogo size={pixelSize} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
