import React from "react";

interface AdPlaceholderProps {
  currentLang?: string;
  isPremium: boolean;
  type: "leaderboard" | "rectangle" | "compact";
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  isPremium,
  type,
  className = ""
}) => {
  // If the user has subscribed to Premium, they must NEVER see advertisements
  if (isPremium) {
    return null;
  }

  let sizeClasses = "";
  let dimensionsLabel = "";

  switch (type) {
    case "leaderboard":
      sizeClasses = "min-h-[90px] w-full max-w-4xl py-4";
      dimensionsLabel = "728 × 90 Leaderboard";
      break;
    case "rectangle":
      sizeClasses = "min-h-[250px] w-full max-w-sm p-6";
      dimensionsLabel = "300 × 250 Native Banner";
      break;
    case "compact":
      sizeClasses = "min-h-[50px] w-full max-w-md py-2";
      dimensionsLabel = "320 × 50 Mobile Banner";
      break;
  }

  /**
   * MONETAG INTEGRATION GUIDE:
   * To add real ads, replace the return content below with:
   * 
   * <div id={`monetag-${type}`} className={className}>
   *   <script src="https://alwingulla.com/act/files/micro.tag.min.js"></script>
   *   <script>
   *      (function(s,u,z,p){s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);})(document.createElement('script'),'https://alwingulla.com/tag.min.js', YOUR_ZONE_ID, document.body);
   *   </script>
   * </div>
   */

  // Placeholder images based on type
  const getPlaceholderImage = () => {
    if (type === "leaderboard") return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800";
    if (type === "rectangle") return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400";
    return "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=320";
  };

  return (
    <div
      className={`relative mx-auto my-6 flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden group shadow-sm transition-all duration-300 hover:shadow-md ${sizeClasses} ${className}`}
    >
      {/* Background Placeholder Image */}
      <img 
        src={getPlaceholderImage()} 
        alt="Sponsor Space" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-10 group-hover:opacity-30 transition-opacity"
      />

      {/* Overlay to keep it professional */}
      <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 dark:to-transparent" />

      <span className="absolute top-2 right-3 z-10 text-[9px] font-black tracking-widest text-indigo-500/60 dark:text-indigo-400/40 uppercase select-none">
        SPONSOR • MONETAG READY
      </span>

      <div className="relative z-10 flex flex-col items-center gap-1.5 pointer-events-none">
        <div className="p-2 bg-indigo-500/10 rounded-xl mb-1">
          <svg className="w-5 h-5 text-indigo-500 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-tighter">
          {dimensionsLabel} SLOT
        </p>
        <p className="text-[9px] font-bold text-slate-400/70 dark:text-zinc-500/70">
          Professional Ad Space Optimized for Monetag
        </p>
      </div>
    </div>
  );
};
