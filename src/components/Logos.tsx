import React from 'react';

export const LogoKemenag: React.FC<{ className?: string; size?: number }> = ({ className = 'w-10 h-10', size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={style} title="Kementerian Agama Republik Indonesia">
      <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Gold Border */}
        <polygon points="100,6 194,74 158,194 42,194 6,74" fill="#EAB308" stroke="#CA8A04" strokeWidth="4"/>
        {/* Inner Green Field */}
        <polygon points="100,16 182,76 150,184 50,184 18,76" fill="#15803D"/>
        {/* Star */}
        <polygon points="100,32 104,46 118,46 107,55 111,69 100,60 89,69 93,55 82,46 96,46" fill="#FACC15"/>
        {/* Rice & Cotton Wreath (stylized) */}
        <path d="M70,80 Q50,120 75,160" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M130,80 Q150,120 125,160" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" fill="none"/>
        {/* Open Quran Book */}
        <path d="M100,105 L68,90 L68,135 L100,145 Z" fill="#FEF08A" stroke="#854D0E" strokeWidth="2.5"/>
        <path d="M100,105 L132,90 L132,135 L100,145 Z" fill="#FEF08A" stroke="#854D0E" strokeWidth="2.5"/>
        {/* Book Stand (Rehal) */}
        <line x1="72" y1="140" x2="128" y2="160" stroke="#1E293B" strokeWidth="4" strokeLinecap="round"/>
        <line x1="128" y1="140" x2="72" y2="160" stroke="#1E293B" strokeWidth="4" strokeLinecap="round"/>
        {/* Ribbon 'IKHLAS BERAMAL' */}
        <path d="M40,168 Q100,158 160,168 L152,180 Q100,170 48,180 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5"/>
        <text x="100" y="176" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">IKHLAS BERAMAL</text>
      </svg>
    </div>
  );
};

export const LogoIpari: React.FC<{ className?: string; size?: number }> = ({ className = 'w-10 h-10', size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={style} title="IPARI - Ikatan Penyuluh Agama Republik Indonesia">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Flame Top (Red/Orange gradient) */}
        <defs>
          <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        
        {/* Red Torch Flame at Top */}
        <path d="M125,25 C135,40 145,55 138,70 C132,80 120,86 112,80 C110,65 118,50 114,38 C118,34 122,30 125,25 Z" fill="url(#flameGrad)"/>
        <path d="M112,50 C110,65 118,75 125,75 C118,82 108,76 106,65 C105,58 108,54 112,50 Z" fill="#FEF08A"/>

        {/* Dynamic Stylized 'i' and 'p' (Green and Dark Slate) */}
        {/* Letter 'i' stem left */}
        <path d="M25,85 C40,88 50,110 50,135 C50,145 42,150 35,152 C45,155 60,150 60,132 C60,105 45,85 25,85 Z" fill="#1E293B"/>

        {/* Main curved green swoosh */}
        <path d="M55,85 L105,85 C118,85 125,95 120,108 C115,120 95,122 75,125 C65,127 60,135 65,145 C70,155 90,158 115,158 L122,142 C100,142 85,140 82,135 C80,130 85,126 95,124 C115,120 135,115 138,98 C142,80 125,70 100,70 L55,70 Z" fill="url(#greenGrad)"/>

        {/* Lower curve black/dark */}
        <path d="M68,145 C65,155 80,165 110,165 C125,165 135,160 135,152 C135,146 128,144 115,144 C95,144 75,140 68,145 Z" fill="#0F172A"/>

        {/* Stylized Right Wings / Flame support */}
        <path d="M135,92 C145,95 155,105 152,125 C150,142 135,152 125,154 C140,150 162,138 160,118 C158,100 148,90 135,92 Z" fill="#1E293B"/>
      </svg>
    </div>
  );
};

export const LogoEPA: React.FC<{ className?: string }> = ({ className = 'h-8' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
      <div className="w-8 h-8 rounded-full border-2 border-emerald-600 flex items-center justify-center bg-emerald-50 text-emerald-700 italic font-serif text-lg shadow-sm">
        e
      </div>
      <span className="text-xl font-black tracking-tight text-teal-700">-PA</span>
    </div>
  );
};
