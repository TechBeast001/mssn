import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Official Federal University Dutse (FUD) Emblem
 * Matches the official FUD university crest uploaded:
 * Open Quran on top, Dutse rocky hills, leaping gazelle/antelope, palm tree, green FUD banner & Knowledge, Excellence & Service ribbon.
 */
export const FUDLogo: React.FC<LogoProps> = ({ className = '', size = 44 }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none ${className}`}
    >
      {!imgError ? (
        <img
          src="/fud_logo.jpg"
          alt="Official Federal University Dutse (FUD) Logo"
          className="w-full h-full object-contain rounded-full"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Vector Fallback matching the official FUD seal */
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Black Outer Background */}
          <circle cx="100" cy="100" r="98" fill="#0A0D0B" />
          
          {/* Top Open Quran Book */}
          <g transform="translate(48, 10) scale(0.52)">
            <path
              d="M 10 35 Q 100 5 190 35 L 190 48 Q 100 18 10 48 Z"
              fill="#FFFFFF"
            />
            <rect x="0" y="32" width="200" height="24" rx="6" fill="#111827" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M 10 38 Q 100 14 190 38" stroke="#FFFFFF" strokeWidth="3" fill="none" />
            {/* Book pages dots */}
            <circle cx="50" cy="44" r="2" fill="#FFFFFF" />
            <circle cx="70" cy="44" r="2" fill="#FFFFFF" />
            <circle cx="130" cy="44" r="2" fill="#FFFFFF" />
            <circle cx="150" cy="44" r="2" fill="#FFFFFF" />
          </g>

          {/* Green Ring */}
          <circle cx="100" cy="106" r="76" stroke="#16A34A" strokeWidth="5" fill="#FFF8E7" />
          
          {/* Palm Tree on left */}
          <g transform="translate(62, 54) scale(0.4)">
            {/* Trunk */}
            <rect x="18" y="35" width="8" height="40" fill="#78350F" />
            {/* Palm leaves */}
            <path d="M 22 35 Q -10 10 -15 25" stroke="#15803D" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 22 35 Q 55 10 60 25" stroke="#15803D" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 22 35 Q 22 -15 26 5" stroke="#16A34A" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 22 35 Q 0 -5 5 10" stroke="#15803D" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 22 35 Q 45 -5 40 10" stroke="#16A34A" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>

          {/* Dutse Rocky Hills (Left and Right) */}
          {/* Left Rock */}
          <path
            d="M 38 128 C 38 95 62 82 78 88 C 90 94 92 118 94 130 Z"
            fill="#262626"
            stroke="#525252"
            strokeWidth="1.5"
          />
          <path d="M 52 92 L 56 128 M 66 89 L 70 128" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Right Rock */}
          <path
            d="M 122 130 C 124 118 126 94 138 88 C 154 82 178 95 178 128 Z"
            fill="#262626"
            stroke="#525252"
            strokeWidth="1.5"
          />
          <path d="M 144 89 L 148 128 M 158 92 L 162 128" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Leaping Gazelle / Antelope in Center (Orange/Red) */}
          <g transform="translate(74, 56) scale(0.65)">
            <path
              d="M 5 45 C 15 35 25 30 45 28 C 55 26 65 15 72 8 C 74 6 78 7 76 10 C 74 15 68 22 66 26 C 68 28 80 32 85 36 C 88 38 85 42 80 40 C 70 36 60 38 52 42 C 40 48 30 58 20 62 C 15 64 5 55 5 45 Z"
              fill="#EA580C"
            />
            {/* Horns & Ears */}
            <path d="M 72 8 L 80 -2 M 70 8 L 74 2" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
            {/* Legs */}
            <path d="M 15 52 L -2 70 M 24 55 L 8 75" stroke="#EA580C" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 60 40 L 78 62 M 65 38 L 86 56" stroke="#EA580C" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* Lower Green Region & Text */}
          <path
            d="M 32 124 Q 100 102 168 124 L 168 152 Q 100 178 32 152 Z"
            fill="#15803D"
          />

          {/* Arched text: FEDERAL UNIVERSITY DUTSE */}
          <path id="fud-text-arch" d="M 40 134 Q 100 114 160 134" fill="none" />
          <text fill="#FACC15" fontSize="7.5" fontWeight="900" letterSpacing="0.5" textAnchor="middle">
            <textPath href="#fud-text-arch" startOffset="50%">
              FEDERAL UNIVERSITY DUTSE
            </textPath>
          </text>

          {/* White FUD Badge text */}
          <text x="100" y="152" fill="#FFFFFF" fontSize="13" fontWeight="900" letterSpacing="2" textAnchor="middle">
            FUD
          </text>

          {/* Bottom Golden Ribbon */}
          <g transform="translate(18, 150)">
            <path
              d="M 12 18 Q 82 30 152 18 L 164 12 L 152 26 Q 82 38 12 26 L 0 12 Z"
              fill="#EAB308"
              stroke="#CA8A04"
              strokeWidth="1"
            />
            <text x="82" y="27" fill="#1C1917" fontSize="6.5" fontWeight="bold" fontStyle="italic" textAnchor="middle">
              Knowledge, Excellence & Service
            </text>
          </g>
        </svg>
      )}
    </div>
  );
};
