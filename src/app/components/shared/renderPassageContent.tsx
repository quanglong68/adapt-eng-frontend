import type { ReactNode } from "react";

export function renderPassageContent(text: string, theme: "indigo" | "emerald" = "indigo"): ReactNode {
  const parts = text.split(/(\[\d+\])/g);
  const highlightClass =
    theme === "indigo"
      ? "text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded"
      : "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded";

  return parts.map((part, index) => {
    if (part.match(/\[\d+\]/)) {
      return (
        <strong key={index} className={highlightClass}>
          {part}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
