import React, { useState } from "react";
import { translations, languages, ToolType } from "../i18n/translations";
import {
  Layers,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  FileText,
  FileImage,
  CreditCard,
  User,
  LogOut
} from "lucide-react";

interface NavbarProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  currentTool: ToolType;
  onNavigate: (tool: ToolType) => void;
  isPremium: boolean;
  dailyConversions: number;
  onOpenUpgradeModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  user: { email: string } | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  currentTool,
  onNavigate,
  isPremium,
  dailyConversions,
  onOpenUpgradeModal,
  darkMode,
  onToggleDarkMode,
  user,
  onLogout,
  onOpenAuth
}) => {
  const t = translations[currentLang] || translations.en;
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedLanguage = languages.find((l) => l.code === currentLang) || languages[0];

  const handleToolClick = (tool: ToolType) => {
    onNavigate(tool);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/85 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => handleToolClick("all")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:rotate-6 transition-transform">
              <Layers className="h-5.5 w-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Universal
              </span>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 leading-none mt-1 uppercase tracking-wider">
                Converter
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleToolClick("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentTool === "all"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900"
              }`}
            >
              {t.navHome}
            </button>

            <button
              onClick={() => handleToolClick("pdf-to-jpg")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                currentTool === "pdf-to-jpg"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              PDF &rarr; JPG
            </button>

            <button
              onClick={() => handleToolClick("jpg-to-pdf")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                currentTool === "jpg-to-pdf"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900"
              }`}
            >
              <FileImage className="w-3.5 h-3.5" />
              JPG &rarr; PDF
            </button>

            <button
              onClick={() => handleToolClick("png-to-webp")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                currentTool === "png-to-webp"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              PNG &rarr; WEBP
            </button>
          </div>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 dark:border-zinc-850 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 cursor-pointer transition-colors"
              aria-label="Toggle theme mode"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Language Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 dark:border-zinc-850 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                <Globe className="w-4 h-4 text-indigo-500" />
                <span>{selectedLanguage.name}</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-52 max-h-80 overflow-y-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 animate-fade-in">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-900 flex items-center justify-between transition-colors cursor-pointer ${
                        currentLang === lang.code
                          ? "text-indigo-600 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/30"
                          : "text-slate-600 dark:text-zinc-400"
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        {lang.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth/User Section */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-100 dark:border-zinc-800">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white max-w-[100px] truncate">{user.email}</span>
                  {isPremium ? (
                     <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter italic">Pro Member</span>
                  ) : (
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Free Plan</span>
                  )}
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Premium Indicator / Call-to-action */}
            {!isPremium && (
              <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-850">
                {dailyConversions}/5 {t.freeLimitCounter}
              </span>
            )}
            {!isPremium && (
              <button
                onClick={onOpenUpgradeModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl transition-all shadow-md shadow-indigo-600/15 active:scale-95 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{t.upgradeBtn}</span>
              </button>
            )}
          </div>

          {/* Mobile menu and collapse triggers */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Quick Dark Mode mobile */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 dark:border-zinc-850 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Picker Selector trigger - compact */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400 dark:border-zinc-850 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-indigo-500" />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-48 max-h-60 overflow-y-auto rounded-xl border border-slate-150 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-900 flex items-center justify-between"
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {lang.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Collapse / Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-slate-100 text-slate-500 hover:bg-slate-50 dark:border-zinc-850 dark:hover:bg-zinc-900 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-50 bg-white dark:bg-zinc-950 px-4 py-4 space-y-3 shadow-lg animate-fade-in">
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => handleToolClick("all")}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentTool === "all"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "text-slate-600 dark:text-zinc-300"
              }`}
            >
              {t.navHome}
            </button>

            <button
              onClick={() => handleToolClick("pdf-to-jpg")}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTool === "pdf-to-jpg"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "text-slate-600 dark:text-zinc-300"
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>{t.pdfToJpgTitle}</span>
            </button>

            <button
              onClick={() => handleToolClick("jpg-to-pdf")}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTool === "jpg-to-pdf"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "text-slate-600 dark:text-zinc-300"
              }`}
            >
              <FileImage className="w-4 h-4 text-emerald-500" />
              <span>{t.jpgToPdfTitle}</span>
            </button>

            <button
              onClick={() => handleToolClick("png-to-webp")}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTool === "png-to-webp"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "text-slate-600 dark:text-zinc-300"
              }`}
            >
              <Layers className="w-4 h-4 text-purple-500" />
              <span>{t.pngToWebpTitle}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-850 flex items-center justify-between">
            {isPremium ? (
              <span className="text-xs font-black text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400 px-3 py-1.5 rounded-lg">
                PRO ACTIVE
              </span>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUpgradeModal();
                }}
                className="w-full text-center py-2.5 px-4 text-xs font-black text-white bg-indigo-600 rounded-xl"
              >
                {t.upgradeBtn}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
