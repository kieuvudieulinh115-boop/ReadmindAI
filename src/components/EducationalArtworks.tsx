import React from 'react';
import { Genre } from '../types';

/**
 * Hero Banner Open Book on Meadow Illustration (Matching Hình 2 & Hình 3 item 1)
 */
export const HeroBannerArtwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 600 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover max-h-[300px]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D8F0FF" />
            <stop offset="60%" stopColor="#EEF8FF" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Sun Glow */}
          <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FFF7D6" stopOpacity="1" />
            <stop offset="50%" stopColor="#FFEAA7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFEAA7" stopOpacity="0" />
          </radialGradient>

          {/* Mountains */}
          <linearGradient id="mountainFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B3DCF2" />
            <stop offset="100%" stopColor="#8EC4E5" />
          </linearGradient>

          <linearGradient id="mountainNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78BF9B" />
            <stop offset="100%" stopColor="#4AA87E" />
          </linearGradient>

          {/* Lake Water */}
          <linearGradient id="lakeWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A8DCF7" />
            <stop offset="100%" stopColor="#67B7E6" />
          </linearGradient>

          {/* Meadow Grassy Hills */}
          <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86D672" />
            <stop offset="40%" stopColor="#5EBF4B" />
            <stop offset="100%" stopColor="#3C9A31" />
          </linearGradient>

          {/* Open Book Gradients */}
          <linearGradient id="pageLeft" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#F9F6ED" />
            <stop offset="85%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#EFE8D6" />
          </linearGradient>

          <linearGradient id="pageRight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F9F6ED" />
            <stop offset="85%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#EFE8D6" />
          </linearGradient>

          <linearGradient id="bookCover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C88435" />
            <stop offset="100%" stopColor="#9E611E" />
          </linearGradient>

          {/* Soft Shadow */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Sky */}
        <rect width="600" height="320" fill="url(#skyGrad)" />

        {/* 2. Morning Sun */}
        <circle cx="280" cy="90" r="120" fill="url(#sunGlow)" />
        <circle cx="280" cy="90" r="35" fill="#FFF3B8" />

        {/* 3. Soft Fluffy Clouds */}
        <path d="M70 65 Q85 45 110 50 Q130 35 155 50 Q175 45 185 65 Z" fill="#FFFFFF" opacity="0.8" />
        <path d="M380 50 Q395 35 415 40 Q430 28 450 40 Q465 35 475 50 Z" fill="#FFFFFF" opacity="0.75" />

        {/* 4. Distant Mountains */}
        <path d="M0 160 Q80 100 170 140 T340 135 T510 130 T600 150 L600 200 L0 200 Z" fill="url(#mountainFar)" opacity="0.65" />
        <path d="M110 165 Q190 120 280 150 T460 145 T600 160 L600 220 L110 220 Z" fill="url(#mountainNear)" opacity="0.85" />

        {/* 5. Serene Blue Lake */}
        <path d="M0 180 Q150 165 300 180 T600 175 L600 240 L0 240 Z" fill="url(#lakeWater)" />
        {/* Lake reflections */}
        <ellipse cx="280" cy="195" rx="50" ry="4" fill="#FFFFFF" opacity="0.6" />
        <ellipse cx="260" cy="205" rx="35" ry="2.5" fill="#FFFFFF" opacity="0.4" />

        {/* 6. Grassy Meadow Foreground */}
        <path d="M0 200 Q140 170 300 215 T600 195 L600 320 L0 320 Z" fill="url(#grassGrad)" />

        {/* 7. Wildflower accents & foliage */}
        <g opacity="0.9">
          {/* Flower 1 */}
          <circle cx="48" cy="235" r="5" fill="#FFF7B2" />
          <circle cx="48" cy="235" r="2.5" fill="#F2994A" />
          {/* Flower 2 */}
          <circle cx="85" cy="265" r="6" fill="#FFFFFF" />
          <circle cx="85" cy="265" r="3" fill="#F2C94C" />
          {/* Flower 3 */}
          <circle cx="160" cy="285" r="5" fill="#FFB8D2" />
          <circle cx="160" cy="285" r="2" fill="#E05688" />
          {/* Flower 4 */}
          <circle cx="530" cy="270" r="6" fill="#FFFFFF" />
          <circle cx="530" cy="270" r="3" fill="#F2C94C" />
          {/* Flower 5 */}
          <circle cx="460" cy="290" r="5" fill="#D4BBFF" />
          <circle cx="460" cy="290" r="2.5" fill="#8A5CF6" />
        </g>

        {/* 8. Open Book on Grassy Hill (Central Hero Element) */}
        <g transform="translate(145, 175)">
          {/* Book Shadow */}
          <ellipse cx="155" cy="105" rx="140" ry="18" fill="#1C5E26" opacity="0.35" />

          {/* Book Spine / Cover Base */}
          <path
            d="M20 95 Q155 112 290 95 L285 102 Q155 118 25 102 Z"
            fill="url(#bookCover)"
          />

          {/* Left Pages Block */}
          <path
            d="M30 92 Q85 86 150 94 L152 42 Q85 32 25 40 Z"
            fill="url(#pageLeft)"
            stroke="#D6CDB9"
            strokeWidth="0.75"
          />
          {/* Page Lines Left */}
          <path d="M45 52 Q85 46 135 52" stroke="#CBDCEB" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <path d="M45 62 Q85 56 135 62" stroke="#CBDCEB" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <path d="M45 72 Q85 66 135 72" stroke="#CBDCEB" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <path d="M45 82 Q85 76 115 82" stroke="#CBDCEB" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

          {/* Right Pages Block */}
          <path
            d="M154 94 Q220 86 280 92 L285 40 Q220 32 152 42 Z"
            fill="url(#pageRight)"
            stroke="#D6CDB9"
            strokeWidth="0.75"
          />
          {/* Page Lines Right */}
          <path d="M170 52 Q215 46 265 52" stroke="#CBDCEB" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <path d="M170 62 Q215 56 265 62" stroke="#CBDCEB" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <path d="M170 72 Q215 66 265 72" stroke="#CBDCEB" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <path d="M170 82 Q215 76 235 82" stroke="#CBDCEB" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

          {/* Center Book Seam */}
          <path d="M151 42 Q152 70 152 95" stroke="#CBB998" strokeWidth="2" strokeLinecap="round" />

          {/* Golden Ribbon Bookmark */}
          <path
            d="M152 42 Q175 65 178 115 L170 110 L163 118 Q162 70 152 42 Z"
            fill="#F2B544"
          />
        </g>

        {/* 9. Butterflies & Sparkles */}
        <g opacity="0.85">
          <path d="M120 120 Q125 110 135 115 Q125 125 120 120 Z" fill="#52B2EC" />
          <path d="M120 120 Q115 110 105 115 Q115 125 120 120 Z" fill="#52B2EC" />
          <circle cx="120" cy="120" r="1.5" fill="#102A43" />

          <path d="M490 140 Q495 130 505 135 Q495 145 490 140 Z" fill="#FFB877" />
          <path d="M490 140 Q485 130 475 135 Q485 145 490 140 Z" fill="#FFB877" />
          <circle cx="490" cy="140" r="1.5" fill="#102A43" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Thematic Artwork Thumbnails for Book Cards (Matching Hình 2 & 3)
 */
export const TextCardThumbnail: React.FC<{
  title: string;
  genre: Genre;
  grade: number;
  className?: string;
}> = ({ title, genre, grade, className = '' }) => {
  const normalizedTitle = title.toLowerCase();

  // 1. Forest & Honey theme (Đi lấy mật, Hành trình của bầy ong, v.v.)
  const isForest = normalizedTitle.includes('mật') || 
                   normalizedTitle.includes('ong') || 
                   normalizedTitle.includes('rừng') ||
                   normalizedTitle.includes('chào mào') ||
                   normalizedTitle.includes('tre');

  // 2. River / Lake / Sea theme (Bầy chim chìa vôi, Cửu Long Giang, Cô Tô, Thu điếu, Ca Huế)
  const isWater = normalizedTitle.includes('bầy chim') || 
                  normalizedTitle.includes('chìa vôi') || 
                  normalizedTitle.includes('sông') || 
                  normalizedTitle.includes('biển') || 
                  normalizedTitle.includes('cô tô') || 
                  normalizedTitle.includes('buồm') ||
                  normalizedTitle.includes('thu điếu');

  // 3. History / Flags / Heroes (Lá cờ thêu sáu chữ vàng, Quang Trung, Hịch tướng sĩ, Nam quốc sơn hà)
  const isHistory = normalizedTitle.includes('lá cờ') || 
                    normalizedTitle.includes('quang trung') || 
                    normalizedTitle.includes('hịch') || 
                    normalizedTitle.includes('nam quốc') || 
                    normalizedTitle.includes('chiếu') || 
                    normalizedTitle.includes('đại phá');

  // 4. Winter / Snow (Cô bé bán diêm, Gió lạnh đầu mùa)
  const isWinter = normalizedTitle.includes('diêm') || 
                   normalizedTitle.includes('gió lạnh');

  // 5. Poetry & Sky (Mây và sóng, Những cánh buồm, Cổ tích về loài người, Ca dao)
  const isSkyOrPoem = genre === 'tho' || normalizedTitle.includes('mây') || normalizedTitle.includes('sóng');

  if (isForest) {
    return (
      <div className={`relative w-full h-full min-h-[140px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#7CE0A6] to-[#2B8B57] flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          {/* Canopy Sun Rays */}
          <radialGradient id="forestSun" cx="0.5" cy="0.1" r="0.8">
            <stop offset="0%" stopColor="#FFF9D2" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#C9F2A6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1B6338" stopOpacity="0" />
          </radialGradient>
          <rect width="200" height="240" fill="#1C5E35" />
          <rect width="200" height="240" fill="url(#forestSun)" />

          {/* Golden Sunbeams */}
          <polygon points="100,0 60,240 85,240 100,0" fill="#FFFBE6" opacity="0.3" />
          <polygon points="100,0 115,240 145,240 100,0" fill="#FFFBE6" opacity="0.25" />

          {/* Canopy Trees */}
          <ellipse cx="25" cy="40" rx="60" ry="70" fill="#20743E" />
          <ellipse cx="175" cy="50" rx="55" ry="65" fill="#1F693A" />
          <ellipse cx="100" cy="15" rx="70" ry="45" fill="#389E5B" opacity="0.85" />

          {/* Forest Floor */}
          <path d="M0 190 Q100 170 200 190 L200 240 L0 240 Z" fill="#144426" />

          {/* Wildflowers */}
          <circle cx="35" cy="215" r="4" fill="#FF84B5" />
          <circle cx="65" cy="225" r="3" fill="#FFD166" />
          <circle cx="155" cy="218" r="4" fill="#FF84B5" />
          <circle cx="175" cy="228" r="3.5" fill="#FFF" />

          {/* Silhouette Deer / Animal */}
          <g transform="translate(90, 155) scale(0.65)">
            <ellipse cx="20" cy="35" rx="14" ry="9" fill="#E8963D" />
            <path d="M26 35 L34 18 L38 20 L30 38 Z" fill="#E8963D" />
            <circle cx="36" cy="16" r="6" fill="#E8963D" />
            {/* Antlers */}
            <path d="M37 12 L38 4 M38 8 L42 5" stroke="#965615" strokeWidth="2" strokeLinecap="round" />
            {/* Legs */}
            <line x1="12" y1="42" x2="10" y2="62" stroke="#BA6E20" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="18" y1="42" x2="17" y2="60" stroke="#9E5913" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="26" y1="42" x2="28" y2="62" stroke="#BA6E20" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  if (isHistory) {
    return (
      <div className={`relative w-full h-full min-h-[140px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFE7C4] to-[#C9532A] flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          {/* Sunset sky */}
          <rect width="200" height="240" fill="#E8713C" />
          <circle cx="100" cy="90" r="50" fill="#FFF2B2" opacity="0.8" />
          
          {/* Ancient Citadel Fortress */}
          <path d="M0 160 L30 160 L30 145 L45 145 L45 160 L80 160 L80 145 L95 145 L95 160 L140 160 L140 145 L155 145 L155 160 L200 160 L200 240 L0 240 Z" fill="#6B2914" />
          
          {/* Golden Royal Flag */}
          <g transform="translate(100, 75)">
            <line x1="0" y1="0" x2="0" y2="70" stroke="#4A1E0D" strokeWidth="3" />
            <path d="M0 5 Q35 -5 60 12 L0 30 Z" fill="#F2B544" stroke="#C07D2B" strokeWidth="1" />
            {/* Red Fire Emblem on flag */}
            <circle cx="25" cy="13" r="5" fill="#D32F2F" />
          </g>

          {/* Mountains */}
          <path d="M0 180 Q60 130 130 170 T200 165 L200 240 L0 240 Z" fill="#421809" opacity="0.9" />
        </svg>
      </div>
    );
  }

  if (isWinter) {
    return (
      <div className={`relative w-full h-full min-h-[140px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#D5EAF7] to-[#7EA8C9] flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          {/* Winter Sky */}
          <rect width="200" height="240" fill="#A8C9E2" />
          {/* Snowy Mountains */}
          <polygon points="20,130 80,60 130,130" fill="#FFFFFF" />
          <polygon points="90,140 145,75 195,140" fill="#E2F1FB" />

          {/* Frozen River */}
          <path d="M0 160 Q80 145 120 180 T200 170 L200 240 L0 240 Z" fill="#C5E2F7" />

          {/* Pine Trees with Snow */}
          <g transform="translate(30, 140)">
            <polygon points="15,0 0,35 30,35" fill="#2E5D4B" />
            <polygon points="15,0 5,12 25,12" fill="#FFFFFF" />
          </g>
          <g transform="translate(150, 145)">
            <polygon points="15,0 0,35 30,35" fill="#2E5D4B" />
            <polygon points="15,0 5,12 25,12" fill="#FFFFFF" />
          </g>

          {/* Cozy Lit Window Cottage */}
          <rect x="75" y="160" width="36" height="26" rx="3" fill="#7D4936" />
          <polygon points="70,160 93,142 116,160" fill="#FFFFFF" />
          <rect x="87" y="168" width="12" height="12" rx="2" fill="#FFE27A" />
        </svg>
      </div>
    );
  }

  if (isWater) {
    // Dawn river with wooden boat (Bầy chim chìa vôi - Matching Hình 2!)
    return (
      <div className={`relative w-full h-full min-h-[140px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFDAB9] via-[#A6E1FA] to-[#4A9FD8] flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          {/* Dawn Sunrise Glow */}
          <rect width="200" height="240" fill="#FDE2BD" />
          <circle cx="100" cy="100" r="60" fill="#FFF0C2" opacity="0.85" />
          <circle cx="100" cy="100" r="25" fill="#FFE082" />

          {/* Riverbank Trees & Greenery */}
          <ellipse cx="20" cy="115" rx="45" ry="35" fill="#52A468" />
          <ellipse cx="180" cy="120" rx="45" ry="35" fill="#439459" />

          {/* Misty Distant Hills */}
          <path d="M0 120 Q60 95 120 115 T200 110 L200 160 L0 160 Z" fill="#8BBDE3" opacity="0.7" />

          {/* Calm River Water */}
          <path d="M0 135 Q100 125 200 135 L200 240 L0 240 Z" fill="#67B4E0" />
          {/* Water reflection ripples */}
          <ellipse cx="100" cy="155" rx="35" ry="3" fill="#FFF3D1" opacity="0.7" />
          <ellipse cx="100" cy="170" rx="22" ry="2" fill="#FFF3D1" opacity="0.5" />

          {/* Wooden Rowboat with 2 travelers (Mon & Mên) */}
          <g transform="translate(60, 160) scale(0.9)">
            {/* Boat body */}
            <path d="M5 14 Q40 26 80 14 L75 22 Q40 28 10 22 Z" fill="#8C5024" />
            <path d="M5 14 Q40 22 80 14" stroke="#663510" strokeWidth="1.5" />

            {/* Figures in boat */}
            <circle cx="30" cy="8" r="4.5" fill="#3D200E" />
            <path d="M27 12 L33 12 L35 18 L25 18 Z" fill="#3285E8" />

            <circle cx="52" cy="8" r="4.5" fill="#3D200E" />
            <path d="M49 12 L55 12 L57 18 L47 18 Z" fill="#F2B544" />

            {/* Oar */}
            <line x1="32" y1="14" x2="18" y2="28" stroke="#52270A" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Riverbank shore foreground */}
          <path d="M0 215 Q100 205 200 215 L200 240 L0 240 Z" fill="#387748" />
          <circle cx="25" cy="225" r="3" fill="#FFF" />
          <circle cx="170" cy="228" r="3" fill="#FFE27A" />
        </svg>
      </div>
    );
  }

  // Default: Sunny Peaceful Pastoral Meadow & Village
  return (
    <div className={`relative w-full h-full min-h-[140px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#D4F1FF] to-[#6BCB77] flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
        {/* Soft Sunny Sky */}
        <rect width="200" height="240" fill="#DDF4FF" />
        <circle cx="150" cy="50" r="30" fill="#FFF275" opacity="0.75" />

        {/* Rolling Hills */}
        <path d="M0 130 Q70 95 150 135 T200 120 L200 240 L0 240 Z" fill="#91D882" />
        <path d="M0 160 Q100 140 200 165 L200 240 L0 240 Z" fill="#58B854" />

        {/* Cozy Cottage */}
        <g transform="translate(65, 130)">
          <rect x="10" y="15" width="40" height="25" rx="2" fill="#FFF8EE" stroke="#E2C9A5" />
          <polygon points="5,15 30,0 55,15" fill="#D9534F" />
          <rect x="25" y="24" width="10" height="16" fill="#8C5024" />
          <rect x="39" y="20" width="8" height="8" rx="1" fill="#70D6FF" />
        </g>

        {/* Big Shade Tree */}
        <g transform="translate(130, 115)">
          <rect x="15" y="30" width="8" height="30" fill="#75471F" />
          <circle cx="19" cy="22" r="24" fill="#369649" />
          <circle cx="14" cy="18" r="18" fill="#52B266" />
        </g>

        {/* Foreground Path & Flowers */}
        <path d="M40 240 Q100 195 160 240 Z" fill="#DFB77C" opacity="0.6" />
        <circle cx="20" cy="220" r="3" fill="#FFF" />
        <circle cx="180" cy="225" r="3" fill="#FF84B5" />
      </svg>
    </div>
  );
};
