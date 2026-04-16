"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";

/**
 * Unified search bar — keyword | type toggle | location
 * Matches the pill design with Business Listings / Local Events toggles.
 *
 * Props:
 *   action           – destination route (default "/results")
 *   initialQuery     – prefill keyword
 *   initialLocation  – prefill location (default "Austin, TX")
 *   initialType      – "businesses" | "events"
 *   variant          – "hero" (rotated) | "inline" (flat)
 *   onSubmit         – optional override handler({ query, location, type })
 */
export default function SearchBar({
  action          = "/results",
  initialQuery    = "",
  initialLocation = "",
  initialType     = "businesses",
  variant         = "hero",
  onSubmit,
}) {
  const router = useRouter();
  const [query,    setQuery]    = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation || "Austin, TX");
  const [type,     setType]     = useState(initialType);

  function submit() {
    if (onSubmit) {
      onSubmit({ query, location, type });
      return;
    }
    const params = new URLSearchParams();
    if (query)    params.set("q",   query);
    if (location) params.set("loc", location);
    params.set("tab", type);
    router.push(action + "?" + params.toString());
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") submit();
  }

  function selectType(t) {
    setType(t);
    // If there's already a query, re-run search with new type
    if (query || location) {
      if (onSubmit) {
        onSubmit({ query, location, type: t });
      } else {
        const params = new URLSearchParams();
        if (query)    params.set("q",   query);
        if (location) params.set("loc", location);
        params.set("tab", t);
        router.push(action + "?" + params.toString());
      }
    }
  }

  return (
    <div className={[styles.pill, variant === "hero" ? styles.hero : styles.inline].join(" ")}>
      {/* ── Keyword input ── */}
      <div className={styles.queryWrap}>
        <span className={"material-icons " + styles.queryIcon}>search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search spots, festivals, or towns..."
          autoComplete="off"
          className={styles.queryInput}
          name="q"
        />
      </div>

      <div className={styles.divider} />

      {/* ── Location ── */}
      <div className={styles.locationWrap}>
        <span className={"material-icons " + styles.locationIcon}>location_on</span>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="City or Zip"
          autoComplete="off"
          className={styles.locationInput}
          name="loc"
        />
      </div>

      <div className={styles.divider} />

      {/* ── Type toggle ── */}
      <div className={styles.typeGroup}>
        <button
          type="button"
          onClick={() => selectType("businesses")}
          aria-pressed={type === "businesses"}
          className={[styles.typeBtn, type === "businesses" ? styles.bizActive : ""].join(" ")}
        >
          <span className={"material-icons " + styles.typeBtnIcon}>storefront</span>
          Business Listings
        </button>
        <button
          type="button"
          onClick={() => selectType("events")}
          aria-pressed={type === "events"}
          className={[styles.typeBtn, type === "events" ? styles.evtActive : ""].join(" ")}
        >
          <span className={"material-icons " + styles.typeBtnIcon}>event</span>
          Local Events
        </button>
      </div>
    </div>
  );
}
