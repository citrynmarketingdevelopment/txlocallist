"use client";

import { useState } from "react";

/**
 * Props:
 *   title     – string  (passed to Web Share API)
 *   url       – string
 *   className – string  (extra classes on the <button>)
 *   iconOnly  – boolean (hide text label; useful for circular hero button)
 */
export default function ShareButton({ title, url, className = "", iconOnly = false }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fallback
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`share-btn font-accent ${className}`.trim()}
    >
      <span className="material-icons share-btn-icon">
        {copied ? "check_circle" : "share"}
      </span>
      {!iconOnly && (copied ? "COPIED!" : "SHARE")}
    </button>
  );
}
