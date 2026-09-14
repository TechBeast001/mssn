import React from 'react';
import { DualLogo } from './DualLogo';

interface HeaderBrandProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'emerald';
  showSubtitle?: boolean;
  subtitleClassName?: string;
  compact?: boolean;
}

export const HeaderBrand: React.FC<HeaderBrandProps> = ({
  size = 'md',
  variant = 'dark',
  showSubtitle = true,
  subtitleClassName = '',
  compact = false
}) => {
  const isEmerald = variant === 'emerald';
  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-3.5 select-none">
      {/* Official MSSN & FUD Dual Logos */}
      <DualLogo size={size} variant={variant} showTogether={!compact} />

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-extrabold tracking-tight ${
              size === 'sm' ? 'text-sm sm:text-base' : size === 'lg' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
            } ${isEmerald || isLight ? 'text-white' : 'text-slate-900'}`}
          >
            MSSN <span className="text-[#0F5132]">FUD</span>
          </span>
          <span
            className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider ${
              isEmerald || isLight
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-emerald-50 text-[#0F5132] border border-emerald-300'
            }`}
          >
            CHAPTER
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-xs font-medium line-clamp-1 ${
              isEmerald || isLight ? 'text-emerald-100' : 'text-slate-500'
            } ${subtitleClassName}`}
          >
            Muslim Students' Society of Nigeria • Federal University Dutse
          </span>
        )}
      </div>
    </div>
  );
};
