"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SaveButton.module.css";

/**
 * Reusable save/unsave heart button.
 *
 * Props:
 *   businessId    – string
 *   initialSaved  – boolean
 *   initialCount  – number
 *   isLoggedIn    – boolean
 *   size          – "sm" | "md" | "lg" | "hero"  (default "md")
 */
export default function SaveButton({
  businessId,
  initialSaved  = false,
  initialCount  = 0,
  isLoggedIn    = false,
  size          = "md",
}) {
  const router  = useRouter();
  const [saved,   setSaved]   = useState(initialSaved);
  const [count,   setCount]   = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isLoggedIn) {
      router.push("/login?next=" + encodeURIComponent(window.location.pathname));
      return;
    }

    setLoading(true);

    // Optimistic update
    setSaved((s) => !s);
    setCount((c) => saved ? Math.max(0, c - 1) : c + 1);

    try {
      const res = await fetch("/api/favorites", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ businessId }),
      });

      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
        setCount(data.count);
      } else {
        setSaved((s) => !s);
        setCount((c) => saved ? c + 1 : Math.max(0, c - 1));
      }
    } catch {
      setSaved((s) => !s);
      setCount((c) => saved ? c + 1 : Math.max(0, c - 1));
    } finally {
      setLoading(false);
    }
  }

  // Hero size shows compact label; other sizes show the count
  const label = size === "hero"
    ? (saved ? "SAVED" : "SAVE")
    : count === 0
      ? "Be the first to save this"
      : `Saved by ${count} ${count === 1 ? "local" : "locals"}`;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Remove from your list" : "Save to your list"}
      className={[
        styles.btn,
        styles[size],
        saved ? styles.saved : "",
        loading ? styles.loading : "",
      ].filter(Boolean).join(" ")}
    >
      <span className={"material-icons " + styles.icon}>
        {saved ? "favorite" : "favorite_border"}
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
