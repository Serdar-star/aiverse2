import React from "react";
import { translations, ToolType } from "../i18n/translations";
import { History, Download, Trash2, ShieldCheck } from "lucide-react";

export interface HistoryItem {
  id: string;
  originalName: string;
  convertedName: string;
  toolType: ToolType;
  date: string;
  size: number;
  blobUrl: string;
}

interface HistoryListProps {
  currentLang: string;
  history: HistoryItem[];
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  currentLang,
  history,
  onClear
}) => {
  const t = translations[currentLang] || translations.en;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getToolLabel = (toolType: ToolType) => {
    switch (toolType) {
      case "pdf-to-jpg":
        return t.pdfToJpgTitle;
      case "jpg-to-pdf":
        return t.jpgToPdfTitle;
      case "png-to-webp":
        return t.pngToWebpTitle;
      default:
        return t.navHome;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.historyTitle}
            </h4>
            <p className="text-xs text-slate-400 dark:text-zinc-500">
              {t.historySavedLocal}
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-white border border-rose-100 hover:bg-rose-600 dark:border-rose-900/50 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t.clearHistory}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-zinc-950 flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-zinc-600">
            <History className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
            {t.noHistory}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-50 dark:border-zinc-800 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Tool</th>
                <th className="py-3 px-4">Original File</th>
                <th className="py-3 px-4">Result File</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors text-sm"
                >
                  <td className="py-3.5 px-4">
                    <span className="inline-flex px-2 py-0.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 rounded-md dark:bg-indigo-950/50 dark:text-indigo-400">
                      {getToolLabel(item.toolType)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-zinc-300 truncate max-w-[150px]">
                    {item.originalName}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[150px]">
                    {item.convertedName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 dark:text-zinc-500 text-xs font-mono">
                    {formatSize(item.size)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Success
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={item.blobUrl}
                      download={item.convertedName}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/50 transition-all active:scale-90"
                      title={t.downloadBtn}
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
