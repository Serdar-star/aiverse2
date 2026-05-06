import React, { useState } from "react";
import { translations, ToolType } from "../i18n/translations";
import { HelpCircle, ChevronDown, BookOpen, Shield, ShieldCheck, Zap } from "lucide-react";

interface ToolInfoProps {
  currentLang: string;
  currentTool: ToolType;
  onNavigate: (tool: ToolType) => void;
}

export const ToolInfo: React.FC<ToolInfoProps> = ({
  currentLang,
  currentTool,
  onNavigate
}) => {
  const t = translations[currentLang] || translations.en;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Toggle Accordion FAQ
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4 space-y-12">
      
      {/* 1. Feature Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-xs text-center flex flex-col items-center">
          <div className="p-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 rounded-2xl mb-4">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <h5 className="font-extrabold text-slate-900 dark:text-white mb-2 text-base">
            100% Client-Side Privacy
          </h5>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Your files never touch any external server. They are converted directly in your browser. Complete privacy.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-xs text-center flex flex-col items-center">
          <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 rounded-2xl mb-4">
            <Zap className="w-6 h-6 animate-bounce" />
          </div>
          <h5 className="font-extrabold text-slate-900 dark:text-white mb-2 text-base">
            Instant Execution
          </h5>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            No uploading. No waiting in remote queues. Convert files in a fraction of a second client-side.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-xs text-center flex flex-col items-center">
          <div className="p-3 bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 rounded-2xl mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h5 className="font-extrabold text-slate-900 dark:text-white mb-2 text-base">
            Safe from Leaks
          </h5>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Since nothing is processed on remote computers, there is no log file, no leakage path, and zero server storage.
          </p>
        </div>
      </div>

      {/* 2. SEO Content: About & Explanation */}
      <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.aboutTitle}
          </h4>
        </div>
        <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-6">
          {t.aboutText}
        </p>
        
        {/* Internal Cross Linking System between other tools to boost Google Rank */}
        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800">
          <h5 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
            Looking for other conversions?
          </h5>
          <div className="flex flex-wrap gap-2">
            {currentTool !== "pdf-to-jpg" && (
              <button
                onClick={() => onNavigate("pdf-to-jpg")}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 dark:bg-zinc-950 dark:hover:bg-indigo-950/50 text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-100 dark:border-zinc-850 rounded-lg transition-colors cursor-pointer"
              >
                {t.pdfToJpgTitle} &rarr;
              </button>
            )}
            {currentTool !== "jpg-to-pdf" && (
              <button
                onClick={() => onNavigate("jpg-to-pdf")}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 dark:bg-zinc-950 dark:hover:bg-indigo-950/50 text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-100 dark:border-zinc-850 rounded-lg transition-colors cursor-pointer"
              >
                {t.jpgToPdfTitle} &rarr;
              </button>
            )}
            {currentTool !== "png-to-webp" && (
              <button
                onClick={() => onNavigate("png-to-webp")}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 dark:bg-zinc-950 dark:hover:bg-indigo-950/50 text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-100 dark:border-zinc-850 rounded-lg transition-colors cursor-pointer"
              >
                {t.pngToWebpTitle} &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Steps Guideline */}
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.stepsTitle}
          </h4>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {t.stepsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50/50 dark:bg-zinc-900/30 rounded-2xl border border-slate-100 dark:border-zinc-850">
            <h6 className="font-extrabold text-slate-800 dark:text-zinc-200 text-sm mb-1.5">
              {t.step1Title}
            </h6>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {t.step1Desc}
            </p>
          </div>
          <div className="p-5 bg-slate-50/50 dark:bg-zinc-900/30 rounded-2xl border border-slate-100 dark:border-zinc-850">
            <h6 className="font-extrabold text-slate-800 dark:text-zinc-200 text-sm mb-1.5">
              {t.step2Title}
            </h6>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {t.step2Desc}
            </p>
          </div>
          <div className="p-5 bg-slate-50/50 dark:bg-zinc-900/30 rounded-2xl border border-slate-100 dark:border-zinc-850">
            <h6 className="font-extrabold text-slate-800 dark:text-zinc-200 text-sm mb-1.5">
              {t.step3Title}
            </h6>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {t.step3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Rich FAQ Section with Schema Support */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 justify-center">
          <HelpCircle className="w-6 h-6 text-indigo-500" />
          <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center">
            {t.faqTitle}
          </h4>
        </div>
        <p className="text-sm text-slate-500 dark:text-zinc-400 text-center max-w-lg mx-auto -mt-4">
          {t.faqSub}
        </p>

        <div className="space-y-4 max-w-3xl mx-auto">
          {t.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-100 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-hidden cursor-pointer"
              >
                <span className="text-sm md:text-base">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180 text-indigo-500" : ""
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openFaq === idx ? "max-h-96 border-t border-slate-50 dark:border-zinc-800/50" : "max-h-0"
                }`}
              >
                <div className="p-5 text-sm text-slate-500 dark:text-zinc-400 leading-relaxed bg-slate-50/30 dark:bg-zinc-900/10">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
