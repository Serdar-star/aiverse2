import React from "react";
import { translations, ToolType } from "../i18n/translations";
import { Layers, FileCode, CheckCircle2, Heart } from "lucide-react";

interface FooterProps {
  currentLang: string;
  onNavigate: (tool: ToolType) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onNavigate }) => {
  const t = translations[currentLang] || translations.en;

  // Dynamically generate and download sitemap.xml client-side
  const handleDownloadSitemap = () => {
    const urls = [
      window.location.origin + "/",
      window.location.origin + "/#/pdf-to-jpg",
      window.location.origin + "/#/jpg-to-pdf",
      window.location.origin + "/#/png-to-webp"
    ];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `<url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`
    )
    .join("\n  ")}
</urlset>`;

    const blob = new Blob([sitemapContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sitemap.xml";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Dynamically generate and download robots.txt client-side
  const handleDownloadRobots = () => {
    const robotsContent = `User-agent: *
Allow: /
Disallow: /checkout/success
Disallow: /api/

Sitemap: https://universal-file-converter.com/sitemap.xml`;

    const blob = new Blob([robotsContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "robots.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <footer className="w-full mt-16 border-t border-slate-100 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-950/40 text-slate-500 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Core footer elements */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("all")}>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-500/20">
                <Layers className="h-5.5 w-5.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  Universal
                </span>
                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 -mt-1 uppercase tracking-[0.2em]">
                  Converter
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed max-w-sm font-medium">
              Global online converter utilizing browser client-side sandboxes. Converts PDF documents and web images with 100% privacy, speed, and safety.
            </p>
          </div>

          {/* Col 2: Fast Tools Access */}
          <div className="space-y-3.5">
            <h6 className="text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-white">
              {t.navTools}
            </h6>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button
                  onClick={() => onNavigate("pdf-to-jpg")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  {t.pdfToJpgTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("jpg-to-pdf")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  {t.jpgToPdfTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("png-to-webp")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  {t.pngToWebpTitle}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: SEO Utilities */}
          <div className="space-y-3.5">
            <h6 className="text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-white">
              SEO Essentials
            </h6>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button
                  onClick={handleDownloadSitemap}
                  className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Generate Sitemap (Sitemap.xml)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleDownloadRobots}
                  className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Generate Robots (Robots.txt)</span>
                </button>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" />
                  Schema Structured Data Active
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Guidelines */}
          <div className="space-y-3.5">
            <h6 className="text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-white">
              SaaS Guidelines
            </h6>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <span className="hover:text-indigo-600 transition-colors cursor-default block">
                  {t.privacyPolicy}
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-600 transition-colors cursor-default block">
                  {t.termsOfService}
                </span>
              </li>
              <li>
                <span className="text-[10px] text-slate-400 dark:text-zinc-600 block">
                  Strictly complies with EU GDPR and California CCPA privacy regulations.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p>
            &copy; {new Date().getFullYear()} Universal File Converter. All rights reserved globally.
          </p>
          <p className="flex items-center gap-1 select-none">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> offline-first client security technology.
          </p>
        </div>

      </div>
    </footer>
  );
};
