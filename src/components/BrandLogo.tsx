import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export default function BrandLogo({ className = "", size = 32 }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      id="optiflow-brand-logo-svg"
    >
      {/* Outer thick black circle */}
      <circle cx="50" cy="50" r="48" fill="#000000" stroke="#10b981" strokeWidth="3" />
      
      {/* Inner thin green circle */}
      <circle cx="50" cy="50" r="44" stroke="#10b981" strokeWidth="1.5" />

      {/* Top Globe Grid (Latitude curves arching UP) */}
      <g stroke="#10b981" strokeWidth="2" fill="none" opacity="0.9">
        {/* Latitudes */}
        <path d="M 14,35 A 38,38 0 0,1 86,35" />
        <path d="M 22,23 A 35,35 0 0,1 78,23" />
        <path d="M 33,13 A 32,32 0 0,1 67,13" />
        
        {/* Longitudes */}
        <line x1="50" y1="6" x2="50" y2="38" />
        <path d="M 31,10 Q 42,24 42,39" />
        <path d="M 19,20 Q 32,28 32,37" />
        <path d="M 69,10 Q 58,24 58,39" />
        <path d="M 81,20 Q 68,28 68,37" />
      </g>

      {/* Bottom Globe Grid (Latitude curves arching DOWN) */}
      <g stroke="#10b981" strokeWidth="2" fill="none" opacity="0.9">
        {/* Latitudes */}
        <path d="M 14,65 A 38,38 0 0,0 86,65" />
        <path d="M 22,77 A 35,35 0 0,0 78,77" />
        <path d="M 33,87 A 32,32 0 0,0 67,87" />
        
        {/* Longitudes */}
        <line x1="50" y1="62" x2="50" y2="94" />
        <path d="M 42,61 Q 42,76 31,90" />
        <path d="M 32,63 Q 32,72 19,80" />
        <path d="M 58,61 Q 58,76 69,90" />
        <path d="M 68,63 Q 68,72 81,80" />
      </g>

      {/* Solid Black Pinched Banner Overlay */}
      <path 
        d="M 4,37 Q 50,45 96,37 L 96,63 Q 50,55 4,63 Z" 
        fill="#000000" 
        stroke="#10b981" 
        strokeWidth="3.5" 
      />

      {/* Styled text "OPTIFLOW" mimicking Spotify's playful/custom hand-drawn look */}
      <g 
        fill="#fafaf9" 
        style={{ 
          fontFamily: "'Space Grotesk', 'Inter', 'Arial Black', sans-serif", 
          fontWeight: 900,
          letterSpacing: "-0.5px"
        }}
      >
        <text x="9" y="56.5" fontSize="16" transform="rotate(-11 9 56.5)">O</text>
        <text x="19.5" y="54" fontSize="15" transform="rotate(-8 19.5 54)">P</text>
        <text x="30" y="52" fontSize="14" transform="rotate(-4 30 52)">T</text>
        <text x="39" y="50" fontSize="14" transform="rotate(-1 39 50)">I</text>
        <text x="45.5" y="50" fontSize="14" transform="rotate(1 45.5 50)">F</text>
        <text x="54.5" y="51.5" fontSize="14.5" transform="rotate(4 54.5 51.5)">L</text>
        <text x="64.5" y="53.5" fontSize="15.5" transform="rotate(7 64.5 53.5)">O</text>
        <text x="75" y="56.5" fontSize="16.5" transform="rotate(11 75 56.5)">W</text>
      </g>
    </svg>
  );
}
