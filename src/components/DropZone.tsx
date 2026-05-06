import React, { useState, useRef } from "react";
import { translations, ToolType } from "../i18n/translations";
import {
  UploadCloud,
  FileImage,
  RefreshCw,
  CheckCircle2,
  FileCheck
} from "lucide-react";
import { AdPlaceholder } from "./AdPlaceholder";
import {
  convertPngToWebp,
  convertJpgToPdf,
  convertPdfToJpg,
  ConversionResult
} from "../utils/converter";

interface DropZoneProps {
  currentLang: string;
  currentTool: ToolType;
  isPremium: boolean;
  onNavigate: (tool: ToolType) => void;
  dailyConversions: number;
  incrementConversions: () => void;
  onOpenUpgradeModal: () => void;
  onSaveToHistory: (originalName: string, convertedName: string, size: number, blobUrl: string) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  currentLang,
  currentTool,
  isPremium,
  onNavigate,
  dailyConversions,
  incrementConversions,
  onOpenUpgradeModal,
  onSaveToHistory
}) => {
  const t = translations[currentLang] || translations.en;

  // Internal states
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Conversion states
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants
  const FREE_MAX_SIZE = 20 * 1024 * 1024; // 20MB
  const PREMIUM_MAX_SIZE = 500 * 1024 * 1024; // 500MB
  const DAILY_LIMIT = 5;

  // Map file extension to tool
  const validateAndSelectTool = (file: File): boolean => {
    setError(null);
    const fileName = file.name.toLowerCase();
    const sizeLimit = isPremium ? PREMIUM_MAX_SIZE : FREE_MAX_SIZE;

    if (file.size > sizeLimit) {
      if (!isPremium) {
        setError(t.fileSizeError);
        setTimeout(() => { onOpenUpgradeModal(); }, 1200);
      } else {
        setError(`File is too large. Max size for PRO is 500MB.`);
      }
      return false;
    }

    if (currentTool === "pdf-to-jpg" && !fileName.endsWith(".pdf")) {
      setError(`${t.fileTypeError} Please upload a .pdf file.`);
      return false;
    } else if (currentTool === "jpg-to-pdf" && !fileName.endsWith(".jpg") && !fileName.endsWith(".jpeg") && !fileName.endsWith(".png")) {
      setError(`${t.fileTypeError} Please upload a JPG, JPEG, or PNG image.`);
      return false;
    } else if (currentTool === "png-to-webp" && !fileName.endsWith(".png")) {
      setError(`${t.fileTypeError} Please upload a PNG image.`);
      return false;
    } else if (currentTool === "all") {
      if (fileName.endsWith(".pdf")) onNavigate("pdf-to-jpg");
      else if (fileName.endsWith(".png")) onNavigate("png-to-webp");
      else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) onNavigate("jpg-to-pdf");
      else {
        setError(t.fileTypeError);
        return false;
      }
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      if (filesArray.length > 1 && !isPremium) {
        onOpenUpgradeModal();
        processFiles([filesArray[0]]);
      } else {
        processFiles(filesArray);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length > 1 && !isPremium) {
        onOpenUpgradeModal();
        processFiles([filesArray[0]]);
      } else {
        processFiles(filesArray);
      }
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(f => validateAndSelectTool(f));
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setConversionResults([]);
    }
  };

  const runConversion = async () => {
    if (selectedFiles.length === 0) return;
    if (!isPremium && (dailyConversions + selectedFiles.length > DAILY_LIMIT)) {
      setError(t.dailyLimitReached);
      onOpenUpgradeModal();
      return;
    }

    setIsProcessing(true);
    const results: ConversionResult[] = [];
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const name = file.name.toLowerCase();
        let activeTool: ToolType = currentTool;
        
        if (activeTool === "all") {
          if (name.endsWith(".pdf")) activeTool = "pdf-to-jpg";
          else if (name.endsWith(".png")) activeTool = "png-to-webp";
          else activeTool = "jpg-to-pdf";
        }
        
        let res: ConversionResult;
        if (activeTool === "png-to-webp") res = await convertPngToWebp(file);
        else if (activeTool === "jpg-to-pdf") res = await convertJpgToPdf(file);
        else res = await convertPdfToJpg(file);
        
        results.push(res);
        onSaveToHistory(file.name, res.fileName, res.fileSize, res.blobUrl);
        incrementConversions();
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }
      setConversionResults(results);
    } catch (err) {
      setError(t.errorText);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setSelectedFiles([]);
    setConversionResults([]);
    setError(null);
    setProgress(0);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + ["Bytes", "KB", "MB"][i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {currentTool === "pdf-to-jpg" ? t.pdfToJpgTitle : currentTool === "jpg-to-pdf" ? t.jpgToPdfTitle : currentTool === "png-to-webp" ? t.pngToWebpTitle : t.heroTitle}
        </h2>
      </div>

      <div className="relative w-full rounded-3xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xl p-6 md:p-8 overflow-hidden">
        {!isPremium && (
          <div className="mb-6 flex items-center justify-between p-3 bg-slate-50 border rounded-2xl dark:bg-zinc-950 gap-2">
            <span className="text-xs font-semibold text-slate-500">{t.freeLimitCounter}: {DAILY_LIMIT - dailyConversions} {t.remainingConversions}</span>
            <button onClick={onOpenUpgradeModal} className="text-xs font-bold text-indigo-600 cursor-pointer">{t.upgradeBtn} &rarr;</button>
          </div>
        )}

        {error && <div className="mb-6 p-4 rounded-2xl bg-rose-50 text-rose-600 text-sm font-semibold">{error}</div>}

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-12 text-center min-h-[300px]">
            <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <h4 className="text-lg font-bold">{t.convertingText} ({progress}%)</h4>
            <div className="w-full max-w-md bg-slate-100 h-2 rounded-full mt-6 overflow-hidden">
              <div className="bg-indigo-600 h-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <AdPlaceholder currentLang={currentLang} isPremium={isPremium} type="rectangle" className="mt-8" />
          </div>
        ) : conversionResults.length > 0 ? (
          <div className="flex flex-col items-center py-6 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-4" />
            <h4 className="text-xl font-extrabold mb-6">{t.successText}</h4>
            <div className="w-full max-w-2xl space-y-3 mb-8">
              {conversionResults.map((res, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border">
                  <div className="flex items-center gap-3 truncate">
                    <FileCheck className="w-5 h-5 text-emerald-500" />
                    <div className="truncate">
                      <p className="text-sm font-bold truncate">{res.fileName}</p>
                      <p className="text-[10px] text-slate-400">{formatBytes(res.fileSize)}</p>
                    </div>
                  </div>
                  <a href={res.blobUrl} download={res.fileName} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black">{t.downloadBtn}</a>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 items-center">
              <button onClick={resetState} className="px-8 py-3 bg-slate-100 rounded-2xl font-bold cursor-pointer hover:bg-slate-200 transition-colors">Convert More Files</button>
              <AdPlaceholder currentLang={currentLang} isPremium={isPremium} type="leaderboard" />
            </div>
          </div>
        ) : selectedFiles.length > 0 ? (
          <div className="py-6 animate-fade-in text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                  <FileImage className="w-5 h-5 text-indigo-500" />
                  <div className="text-left truncate">
                    <p className="text-xs font-bold truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{formatBytes(file.size)}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={runConversion} className="px-12 py-5 text-white bg-indigo-600 rounded-3xl font-black text-lg cursor-pointer shadow-lg shadow-indigo-600/30 hover:scale-105 transition-transform">
              {t.convertBtn} ({selectedFiles.length})
            </button>
            <AdPlaceholder currentLang={currentLang} isPremium={isPremium} type="leaderboard" className="mt-8" />
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()} 
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl py-14 px-6 text-center cursor-pointer min-h-[300px] transition-all ${dragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' : 'border-slate-200 hover:border-indigo-300'}`}
          >
            <input ref={fileInputRef} type="file" multiple={isPremium} onChange={handleChange} className="hidden" />
            <UploadCloud className={`w-12 h-12 mx-auto mb-4 transition-transform ${dragActive ? 'scale-110 text-indigo-500' : 'text-slate-400'}`} />
            <h3 className="text-xl font-bold mb-2">{t.dropZoneTitle}</h3>
            <p className="text-sm text-slate-400 mb-6">{t.dropZoneSub}</p>
            {!isPremium && <p className="text-xs text-indigo-500 font-bold">{t.batchUploadNotice}</p>}
            <AdPlaceholder currentLang={currentLang} isPremium={isPremium} type="leaderboard" className="mt-8" />
          </div>
        )}
      </div>
    </div>
  );
};
