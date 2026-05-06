import React from 'react';
import { 
  Zap, 
  Globe, 
  Cpu, 
  Lock
} from 'lucide-react';

interface BentoGridProps {
  currentLang: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ currentLang }) => {
  const features = [
    {
      title: currentLang === 'tr' ? "Önce Gizlilik" : "Privacy First",
      desc: currentLang === 'tr' ? "Dosyalar tarayıcıda işlenir. Sunucuya yükleme sıfır." : "Files are processed in a local browser sandbox. Zero server uploads.",
      icon: <Lock className="w-6 h-6" />,
      className: "md:col-span-2 bg-indigo-600 text-white",
    },
    {
      title: currentLang === 'tr' ? "Işık Hızında" : "Lightning Fast",
      desc: currentLang === 'tr' ? "Paralel istemci taraflı işleme." : "Parallel client-side processing.",
      icon: <Zap className="w-6 h-6" />,
      className: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
    },
    {
      title: currentLang === 'tr' ? "Küresel Destek" : "Global Edge",
      desc: currentLang === 'tr' ? "12+ Dil desteği." : "12+ Languages supported.",
      icon: <Globe className="w-6 h-6" />,
      className: "bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-zinc-100",
    },
    {
      title: currentLang === 'tr' ? "PRO Gücü" : "PRO Power",
      desc: currentLang === 'tr' ? "500MB Limit ve Toplu İşlem." : "500MB Limit & Batching.",
      icon: <Cpu className="w-6 h-6" />,
      className: "md:col-span-2 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          {currentLang === 'tr' ? "Kurumsal Sınıf Teknoloji" : "Enterprise Grade Technology"}
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
          {currentLang === 'tr' 
            ? "Dünyanın en güvenli dosya dönüştürme mimarisini deneyimleyin. Bulut yok, risk yok, sadece saf performans."
            : "Experience the world's most secure file conversion architecture. No cloud, no risk, just pure performance."}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className={`p-8 rounded-[2rem] shadow-xs flex flex-col justify-between min-h-[220px] transition-transform hover:scale-[1.02] ${f.className}`}>
            <div className="p-3 bg-white/20 w-fit rounded-2xl backdrop-blur-md">
              {f.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-sm opacity-80 font-medium">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
