import { useState, useEffect } from "react";
import { translations, ToolType } from "./i18n/translations";
import { Navbar } from "./components/Navbar";
import { DropZone } from "./components/DropZone";
import { ToolInfo } from "./components/ToolInfo";
import { HistoryList, HistoryItem } from "./components/HistoryList";
import { PremiumModal } from "./components/PremiumModal";
import { AuthModal } from "./components/AuthModal";
import { SeoMetadata } from "./components/SeoMetadata";
import { AdPlaceholder } from "./components/AdPlaceholder";
import { Footer } from "./components/Footer";
import { BentoGrid } from "./components/BentoGrid";
import { Flame } from "lucide-react";
import { auth, onAuthStateChanged, signOut } from "./lib/firebase";

export default function App() {
  // 1. Language States (Auto-detecting browser language)
  const [currentLang, setCurrentLang] = useState<string>("en");

  // 2. Tool Route State ('all' | 'pdf-to-jpg' | 'jpg-to-pdf' | 'png-to-webp')
  const [currentTool, setCurrentTool] = useState<ToolType>("all");

  // 3. Theme State (Dark mode native Tailwind class support)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 4. User and Premium status
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const saved = localStorage.getItem("user_session");
    return saved ? JSON.parse(saved) : null;
  });

  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem("premium_unlocked") === "true";
  });

  // 5. Daily Conversions Limit Tracker
  const [dailyConversions, setDailyConversions] = useState<number>(0);

  // 6. Conversion History Saved Locally
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 7. Modals
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Date String key to manage daily conversion reset
  const getTodayKey = () => {
    const today = new Date();
    return `conversions_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  // On Mount: Auto-detect browser language, Routing, Theme, Limits & History
  useEffect(() => {
    // A. Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u = { email: firebaseUser.email || "" };
        setUser(u);
        localStorage.setItem("user_session", JSON.stringify(u));
      } else {
        setUser(null);
        localStorage.removeItem("user_session");
      }
    });

    // B. Language Auto-Detection
    try {
      const savedLang = localStorage.getItem("user_preferred_language");
      if (savedLang && translations[savedLang]) {
        setCurrentLang(savedLang);
      } else {
        const browserLang = window.navigator.language.split("-")[0]; // e.g. 'es-ES' -> 'es'
        if (translations[browserLang]) {
          setCurrentLang(browserLang);
          localStorage.setItem("user_preferred_language", browserLang);
        } else {
          setCurrentLang("en"); // fallback
        }
      }
    } catch (e) {
      console.warn("Language detection error:", e);
    }

    // C. Custom Hash-Routing Listener
    const handleHashRouting = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "");
      if (["pdf-to-jpg", "jpg-to-pdf", "png-to-webp"].includes(hash)) {
        setCurrentTool(hash as ToolType);
      } else {
        setCurrentTool("all");
      }
      // Scroll smoothly back to top when navigating
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashRouting);
    handleHashRouting(); // Run initial routing calculation

    // D. Theme Initialization
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // E. Daily limit check
    const key = getTodayKey();
    const count = localStorage.getItem(key);
    if (count) {
      setDailyConversions(parseInt(count, 10));
    } else {
      setDailyConversions(0);
    }

    // F. Local history retrieval
    try {
      const savedHistory = localStorage.getItem("conversion_history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn("Could not load conversion history:", e);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashRouting);
      unsubscribe();
    };
  }, [darkMode]);

  // Handle manual language change
  const handleLanguageChange = (lang: string) => {
    if (translations[lang]) {
      setCurrentLang(lang);
      localStorage.setItem("user_preferred_language", lang);
    }
  };

  // Handle theme toggles
  const handleToggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem("theme", nextMode ? "dark" : "light");
    if (nextMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Auth Handlers
  const handleLogin = (email: string) => {
    const newUser = { email };
    setUser(newUser);
    localStorage.setItem("user_session", JSON.stringify(newUser));
    // In a real app, you would check if this user is Pro in your DB
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user_session");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Unlock Premium Status
  const handleActivatePremium = (email: string) => {
    setIsPremium(true);
    localStorage.setItem("premium_unlocked", "true");
    localStorage.setItem("premium_user_email", email);
    if (!user) {
      handleLogin(email);
    }
  };

  // Increment completed conversion limit counter
  const handleIncrementConversions = () => {
    const nextCount = dailyConversions + 1;
    setDailyConversions(nextCount);
    localStorage.setItem(getTodayKey(), nextCount.toString());
  };

  // Add conversions to local list
  const handleSaveToHistory = (
    originalName: string,
    convertedName: string,
    size: number,
    blobUrl: string
  ) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      originalName,
      convertedName,
      toolType: currentTool,
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      size,
      blobUrl
    };

    const updated = [newItem, ...history].slice(0, 30); // limit local history to 30 items
    setHistory(updated);
    localStorage.setItem("conversion_history", JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("conversion_history");
  };

  // Update hash route navigation manually
  const handleNavigate = (tool: ToolType) => {
    setCurrentTool(tool);
    if (tool === "all") {
      window.location.hash = "";
    } else {
      window.location.hash = `/${tool}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 dark:bg-zinc-950 dark:text-zinc-100 font-sans transition-colors duration-300 selection:bg-indigo-500 selection:text-white">
      
      {/* Dynamic SEO Injector Side effect */}
      <SeoMetadata currentLang={currentLang} currentTool={currentTool} />

      {/* Global SaaS Header Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        currentTool={currentTool}
        onNavigate={handleNavigate}
        isPremium={isPremium}
        dailyConversions={dailyConversions}
        onOpenUpgradeModal={() => setUpgradeModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Auth Modal for Email and Google Logic */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Beautiful SaaS Promo Banner for Free users */}
      {!isPremium && (
        <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold py-2 px-4 text-center select-none flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 animate-bounce text-yellow-400" />
            <span>Premium Performance: 500MB Limit & Lightning Speed</span>
          </div>
          <button
            onClick={() => setUpgradeModalOpen(true)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1 rounded-full font-bold transition-all uppercase tracking-wider text-[10px] cursor-pointer shadow-xs"
          >
            Try Pro
          </button>
        </div>
      )}

      {/* Grid Pattern Hero Details background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]" />

      {/* Main SaaS Platform Dashboard Container */}
      <main className="pb-16 pt-6">
        
        {/* Core Drop & Upload sandbox component above fold */}
        <DropZone
          currentLang={currentLang}
          currentTool={currentTool}
          isPremium={isPremium}
          onNavigate={handleNavigate}
          dailyConversions={dailyConversions}
          incrementConversions={handleIncrementConversions}
          onOpenUpgradeModal={() => setUpgradeModalOpen(true)}
          onSaveToHistory={handleSaveToHistory}
        />

        {/* Professional Bento Grid Features */}
        <BentoGrid currentLang={currentLang} />

        {/* Localized detailed SEO FAQs and step guides */}
        <ToolInfo
          currentLang={currentLang}
          currentTool={currentTool}
          onNavigate={handleNavigate}
        />

        {/* Global Conversion History list dashboard */}
        <HistoryList
          currentLang={currentLang}
          history={history}
          onClear={handleClearHistory}
        />

        {/* Standard Programmatic display ad bottom leaderboard */}
        <AdPlaceholder currentLang={currentLang} isPremium={isPremium} type="leaderboard" className="mt-8" />
      </main>

      {/* SaaS Global Footer component with Dynamic Sitemap and Robots.txt generations */}
      <Footer currentLang={currentLang} onNavigate={handleNavigate} />

      {/* Premium Upgrade Modal trigger */}
      <PremiumModal
        currentLang={currentLang}
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onSuccess={handleActivatePremium}
      />
    </div>
  );
}
