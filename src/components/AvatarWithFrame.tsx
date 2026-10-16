import React from 'react';

interface AvatarWithFrameProps {
  avatar: string;
  frameId?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

export const AvatarWithFrame: React.FC<AvatarWithFrameProps> = ({
  avatar,
  frameId,
  size = 'md',
  className = '',
  showGlow = false
}) => {
  // Size dimensions map
  const sizeMap = {
    xs: { outer: 'w-7 h-7', inner: 'w-6 h-6', text: 'text-sm', frameOffset: '-inset-1' },
    sm: { outer: 'w-9 h-9', inner: 'w-8 h-8', text: 'text-lg', frameOffset: '-inset-1.5' },
    md: { outer: 'w-11 h-11', inner: 'w-9 h-9', text: 'text-xl', frameOffset: '-inset-2' },
    lg: { outer: 'w-16 h-16', inner: 'w-13 h-13', text: 'text-3xl', frameOffset: '-inset-2.5' },
    xl: { outer: 'w-22 h-22', inner: 'w-18 h-18', text: 'text-5xl', frameOffset: '-inset-3' }
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap.outer} ${className}`}>
      {/* 1. Base Avatar Circle */}
      <div 
        className={`${sizeMap.inner} rounded-full bg-gradient-to-br from-[#E0F8F3] to-[#C7F0E8] border border-[#BDE8E0] flex items-center justify-center ${sizeMap.text} shadow-2xs select-none overflow-hidden relative z-10 transition-transform`}
      >
        <span>{avatar || '🦉'}</span>
      </div>

      {/* 2. Decorative Frame Overlays */}
      {frameId === 'frame-lotus' && (
        <div className={`absolute ${sizeMap.frameOffset} pointer-events-none z-20 flex items-center justify-center`}>
          {/* Lotus SVG Frame */}
          <svg className="w-full h-full animate-in fade-in zoom-in-95 duration-300" viewBox="0 0 100 100" fill="none">
            {/* Outer Soft Glow Halo */}
            <circle cx="50" cy="50" r="44" stroke="url(#lotus-grad-halo)" strokeWidth="4" opacity="0.85" />
            <circle cx="50" cy="50" r="41" stroke="#00A99D" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
            
            {/* Top Leaf Accent */}
            <path d="M50 3 C53 10, 56 12, 50 17 C44 12, 47 10, 50 3 Z" fill="#00A99D" opacity="0.9" />
            
            {/* Left and Right Petals */}
            <path d="M4 50 C11 47, 13 44, 18 50 C13 56, 11 53, 4 50 Z" fill="#E879A9" opacity="0.85" />
            <path d="M96 50 C89 47, 87 44, 82 50 C87 56, 89 53, 96 50 Z" fill="#E879A9" opacity="0.85" />

            {/* Bottom Lotus Blossom */}
            <g transform="translate(50, 93)">
              {/* Outer pink petals */}
              <path d="M-14 -12 C-18 -4, -10 2, 0 4 C10 2, 18 -4, 14 -12 C10 -6, 5 -3, 0 -2 C-5 -3, -10 -6, -14 -12 Z" fill="#F472B6" />
              {/* Inner lotus center */}
              <path d="M-8 -15 C-10 -7, -4 0, 0 1 C4 0, 10 -7, 8 -15 C5 -9, 2 -5, 0 -4 C-2 -5, -5 -9, -8 -15 Z" fill="#EC4899" />
              <path d="M-3 -16 C-4 -9, -1 -2, 0 0 C1 -2, 4 -9, 3 -16 C1 -11, 0 -7, 0 -7 C0 -7, -1 -11, -3 -16 Z" fill="#FDF2F8" />
              {/* Gold pollen center */}
              <circle cx="0" cy="-3" r="2" fill="#F59E0B" />
            </g>

            {/* Water droplet accents */}
            <circle cx="20" cy="18" r="2" fill="#38BDF8" opacity="0.8" />
            <circle cx="80" cy="18" r="2" fill="#38BDF8" opacity="0.8" />

            <defs>
              <linearGradient id="lotus-grad-halo" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="50%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {frameId === 'frame-gold' && (
        <div className={`absolute ${sizeMap.frameOffset} pointer-events-none z-20 flex items-center justify-center`}>
          {/* Royal Gold Dragon Frame */}
          <svg className="w-full h-full animate-in fade-in zoom-in-95 duration-300" viewBox="0 0 100 100" fill="none">
            {/* Outer Shimmering Gold Ring */}
            <circle cx="50" cy="50" r="45" stroke="url(#gold-ring-grad)" strokeWidth="4" />
            <circle cx="50" cy="50" r="41.5" stroke="#78350F" strokeWidth="1" opacity="0.4" />
            <circle cx="50" cy="50" r="47.5" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 3" />

            {/* 4 Corner Crest Accents */}
            {/* Top Crown */}
            <path d="M43 7 L50 2 L57 7 L54 12 L46 12 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
            <circle cx="50" cy="6" r="1.5" fill="#EF4444" />
            
            {/* Left Wing */}
            <path d="M7 45 L2 50 L7 55 L11 50 Z" fill="#FBBF24" stroke="#78350F" strokeWidth="0.8" />
            {/* Right Wing */}
            <path d="M93 45 L98 50 L93 55 L89 50 Z" fill="#FBBF24" stroke="#78350F" strokeWidth="0.8" />
            {/* Bottom Jewel */}
            <circle cx="50" cy="94" r="3.5" fill="#EF4444" stroke="#FDE68A" strokeWidth="1" />

            <defs>
              <linearGradient id="gold-ring-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="30%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#FEF3C7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {frameId === 'frame-rainbow' && (
        <div className={`absolute ${sizeMap.frameOffset} pointer-events-none z-20 flex items-center justify-center`}>
          {/* Shimmering Rainbow Aurora Frame */}
          <svg className="w-full h-full animate-in fade-in zoom-in-95 duration-300" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44.5" stroke="url(#rainbow-grad)" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="50" cy="50" r="41" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
            
            {/* Star Sparkles */}
            <path d="M22 22 L24 18 L26 22 L30 24 L26 26 L24 30 L22 26 L18 24 Z" fill="#FFFBEB" />
            <path d="M78 20 L79.5 17 L81 20 L84 21.5 L81 23 L79.5 26 L78 23 L75 21.5 Z" fill="#FFFBEB" />
            <path d="M80 76 L81 74 L82 76 L84 77 L82 78 L81 80 L80 78 L78 77 Z" fill="#FFFBEB" />

            <defs>
              <linearGradient id="rainbow-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F43F5E" />
                <stop offset="20%" stopColor="#FB923C" />
                <stop offset="40%" stopColor="#FACC15" />
                <stop offset="60%" stopColor="#34D399" />
                <stop offset="80%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {showGlow && frameId && (
        <div className="absolute inset-0 rounded-full blur-xs bg-amber-400/20 -z-1 pointer-events-none" />
      )}
    </div>
  );
};
