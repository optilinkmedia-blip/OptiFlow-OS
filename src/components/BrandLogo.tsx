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
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      id="optiflow-brand-logo-svg"
    >
      <defs>
        <clipPath id="globe-clip">
          <circle cx="250" cy="250" r="230" />
        </clipPath>
        <path id="banner-text-path" d="M 40 295 Q 250 215 460 295" />
      </defs>

      {/* Base Globe Fill - Spotify Green */}
      <circle cx="250" cy="250" r="230" fill="#1ed760" />

      {/* Grid Lines Group - Clipped to Globe */}
      <g clipPath="url(#globe-clip)" stroke="#000000" strokeWidth="16" strokeLinecap="round" fill="none">
        {/* Latitudes (Horizontal-ish Curves) */}
        {/* Top hemisphere */}
        <path d="M 0 100 Q 250 -20 500 100" />
        <path d="M 0 180 Q 250 80 500 180" />
        {/* Bottom hemisphere */}
        <path d="M 0 320 Q 250 420 500 320" />
        <path d="M 0 400 Q 250 520 500 400" />

        {/* Longitudes (Vertical-ish Curves) */}
        <line x1="250" y1="0" x2="250" y2="500" />
        <path d="M 170 0 Q 130 250 170 500" />
        <path d="M 90 0 Q 30 250 90 500" />
        <path d="M 330 0 Q 370 250 330 500" />
        <path d="M 410 0 Q 470 250 410 500" />

        {/* The Black Banner - Rotated */}
        <g transform="rotate(-15 250 250)">
          <path 
            d="M -100 200 Q 250 120 600 200 L 600 320 Q 250 240 -100 320 Z" 
            fill="#000000" 
            stroke="none" 
          />
        </g>
      </g>

      {/* Text inside the banner - Rotated identically */}
      <g transform="rotate(-15 250 250)">
        <text 
          fill="#f4eadc" 
          fontFamily="'Space Grotesk', 'Outfit', 'Inter', 'Arial Black', sans-serif" 
          fontWeight="900" 
          fontSize="76" 
          letterSpacing="1"
        >
          <textPath href="#banner-text-path" startOffset="50%" textAnchor="middle">
            OPTIFLOW
          </textPath>
        </text>
      </g>

      {/* Thick Outer Outline */}
      <circle cx="250" cy="250" r="230" fill="none" stroke="#000000" strokeWidth="24" />
    </svg>
  );
}
