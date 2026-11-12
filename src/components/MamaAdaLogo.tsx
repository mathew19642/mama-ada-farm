interface MamaAdaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const MamaAdaLogo = ({
  className = '',
  size = 'md',
  showText = true
}: MamaAdaLogoProps) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Icon SVG Badge */}
      <div className={`relative ${sizeMap[size]} rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 p-0.5 shadow-md shadow-emerald-900/20 shrink-0 flex items-center justify-center overflow-hidden`}>
        {/* Subtle inner sun glow */}
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400/40 blur-xs" />
        
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Golden Sun */}
          <circle cx="28" cy="12" r="5" fill="#FBBF24" />
          <path d="M28 4V6M36 12H34M33.6 6.4L32.2 7.8M33.6 17.6L32.2 16.2" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />

          {/* Rolling Terraced Hills */}
          <path
            d="M2 34C10 26 18 29 25 34H2Z"
            fill="#047857"
            opacity="0.8"
          />
          <path
            d="M12 36C20 28 28 30 38 36H12Z"
            fill="#065F46"
          />

          {/* Growing Sprout / Leaves in Foreground */}
          <path
            d="M18 36V22C18 17 21 15 25 15C25 19 22 23 18 24"
            fill="#34D399"
          />
          <path
            d="M18 26C15 21 11 20 8 22C8 26 13 27 18 28"
            fill="#6EE7B7"
          />
          <path
            d="M18 36V18"
            stroke="#A7F3D0"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-stone-900 tracking-tight text-base sm:text-lg group-hover:text-emerald-700 transition-colors">
              Mama Ada Farm
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wide uppercase">
              Organic
            </span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium tracking-tight">
            Living Soils • Fresh Harvests
          </p>
        </div>
      )}
    </div>
  );
};

