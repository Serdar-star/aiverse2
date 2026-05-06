import React, { useEffect } from "react";
import { translations, ToolType } from "../i18n/translations";

interface SeoMetadataProps {
  currentLang: string;
  currentTool: ToolType;
}

export const SeoMetadata: React.FC<SeoMetadataProps> = ({ currentLang, currentTool }) => {
  const t = translations[currentLang] || translations.en;

  // Compute Tool specific details
  let pageTitle = t.metaTitle;
  let pageDesc = t.metaDesc;
  let toolName = "Universal File Converter";

  if (currentTool === "pdf-to-jpg") {
    toolName = t.pdfToJpgTitle;
    pageTitle = `${t.pdfToJpgTitle} | ${t.metaTitle}`;
    pageDesc = `${t.pdfToJpgDesc} ${t.metaDesc}`;
  } else if (currentTool === "jpg-to-pdf") {
    toolName = t.jpgToPdfTitle;
    pageTitle = `${t.jpgToPdfTitle} | ${t.metaTitle}`;
    pageDesc = `${t.jpgToPdfDesc} ${t.metaDesc}`;
  } else if (currentTool === "png-to-webp") {
    toolName = t.pngToWebpTitle;
    pageTitle = `${t.pngToWebpTitle} | ${t.metaTitle}`;
    pageDesc = `${t.pngToWebpDesc} ${t.metaDesc}`;
  }

  useEffect(() => {
    // 1. Update Title
    document.title = pageTitle;

    // 2. Update Meta Description
    let metaDescEl = document.querySelector('meta[name="description"]');
    if (!metaDescEl) {
      metaDescEl = document.createElement("meta");
      metaDescEl.setAttribute("name", "description");
      document.head.appendChild(metaDescEl);
    }
    metaDescEl.setAttribute("content", pageDesc);

    // 3. Update Robots
    let metaRobotsEl = document.querySelector('meta[name="robots"]');
    if (!metaRobotsEl) {
      metaRobotsEl = document.createElement("meta");
      metaRobotsEl.setAttribute("name", "robots");
      document.head.appendChild(metaRobotsEl);
    }
    metaRobotsEl.setAttribute("content", "index, follow");

    // 4. Inject JSON-LD Schema
    const schemaId = "file-converter-jsonld-schema";
    let schemaEl = document.getElementById(schemaId);
    if (schemaEl) {
      schemaEl.remove();
    }

    const applicationSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": toolName,
      "operatingSystem": "All",
      "applicationCategory": "MultimediaApplication",
      "browserRequirements": "Requires HTML5 Canvas, File API",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "18452"
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": t.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };

    const combinedScript = document.createElement("script");
    combinedScript.id = schemaId;
    combinedScript.type = "application/ld+json";
    combinedScript.text = JSON.stringify([applicationSchema, faqSchema]);
    document.head.appendChild(combinedScript);

    // Update html lang tag
    document.documentElement.lang = currentLang;
    const isRtl = currentLang === "ar";
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [pageTitle, pageDesc, currentLang, currentTool, t, toolName]);

  return null; // Side effect component
};
