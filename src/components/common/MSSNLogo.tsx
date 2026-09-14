import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Official Muslim Students' Society of Nigeria (MSSN) Emblem
 * Matches the official green wreath, star & crescent logo uploaded by the chapter.
 */
export const MSSNLogo: React.FC<LogoProps> = ({ className = '', size = 44 }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none ${className}`}
    >
      {!imgError ? (
        <img
          src="/mssn_logo.jpg"
          alt="Official Muslim Students' Society of Nigeria (MSSN) Logo"
          className="w-full h-full object-contain rounded-full bg-white"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Vector Fallback matching the official MSSN emblem */
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <circle cx="100" cy="100" r="98" fill="#FFFFFF" />
          
          {/* Outer Leafy Wreath Ring */}
          <circle cx="100" cy="100" r="92" stroke="#006837" strokeWidth="6" strokeDasharray="8 4" fill="none" />
          <circle cx="100" cy="100" r="86" fill="#006837" />
          <circle cx="100" cy="100" r="76" fill="#FFFFFF" />
          
          {/* Inner Green Circle */}
          <circle cx="100" cy="100" r="48" fill="#006837" />
          
          {/* Arched Text Path Top */}
          <path id="mssn-text-path-top" d="M 32 100 A 68 68 0 0 1 168 100" fill="none" />
          <text fill="#006837" fontSize="10" fontWeight="900" letterSpacing="1" textAnchor="middle">
            <textPath href="#mssn-text-path-top" startOffset="50%">
              MUSLIM STUDENTS' SOCIETY
            </textPath>
          </text>
          
          {/* Small Dot */}
          <circle cx="100" cy="154" r="3" fill="#006837" />
          
          {/* Lower Ribbon Banner for NIGERIA */}
          <path d="M 60 162 Q 100 176 140 162 L 144 174 Q 100 188 56 174 Z" fill="#006837" />
          <text x="100" y="174" fill="#FFFFFF" fontSize="9" fontWeight="900" letterSpacing="2" textAnchor="middle">
            NIGERIA
          </text>
          
          {/* Center White Star & Crescent */}
          {/* Crescent */}
          <path
            d="M 108 76 A 24 24 0 1 1 92 124 A 19 19 0 1 0 108 76 Z"
            fill="#FFFFFF"
          />
          {/* Star */}
          <polygon
            points="94,84 97,93 106,93 99,99 101,108 94,102 87,108 89,99 82,93 91,93"
            fill="#FFFFFF"
          />
        </svg>
      )}
    </div>
  );
};
