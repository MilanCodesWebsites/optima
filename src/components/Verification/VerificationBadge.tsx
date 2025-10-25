import React from 'react';

interface VerificationBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ size = 'md', showTooltip = true }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  return (
    <div className="inline-flex items-center group relative animate-fade-in">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-neon-green/30 rounded-full blur-sm animate-pulse"></div>
        
        {/* Badge Image */}
        <img
          src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/5e6d9a70-7169-4825-9ad8-b702cca6f80f-approve.png"
          alt="Verified"
          className={`${sizeClasses[size]} relative z-10 animate-scale-in`}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
          <div className="flex items-center gap-1.5">
            <img
              src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/5e6d9a70-7169-4825-9ad8-b702cca6f80f-approve.png"
              alt="Verified"
              className="w-3 h-3"
            />
            <span>I~2 Premium Verified</span>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationBadge;
