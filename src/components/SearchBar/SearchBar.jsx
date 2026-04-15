"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./SearchBar.module.css";

/**
 * Hero search bar (keyword + city/zip). Submits to `/search?q=&loc=` by default.
 *
 * Props:
 *   - action:           form action path (default "/search")
 *   - method:           "GET" (default) or "POST"
 *   - initialQuery:     prefill for the keyword input
 *   - initialLocation:  prefill for the location input
 *   - onSubmit:         optional override handler ({ query, location })
 *   - variant:          "hero" (default, rotated chunky) | "inline"
 */
export default function SearchBar({
  action = "/search",
  method = "GET",
  initialQuery = "",
  initialLocation = "",
  onSubmit,
  variant = "hero",
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit({ query, location });
      return;
    }

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("loc", location);

    router.push(`${action}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form
      className={`${styles.searchContainer} ${variant === "inline" ? styles.inline : ""}`.trim()}
      role="search"
      action={action}
      method={method}
      onSubmit={handleSubmit}
    >
      <label className={styles.searchInput}>
        <span className="sr-only">What are you looking for?</span>
        <span className={`material-icons ${styles.searchIcon}`} aria-hidden="true">
          search
        </span>
        <input
          name="q"
          placeholder="What are you looking for?"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </label>

      <label className={styles.searchInput}>
        <span className="sr-only">City or Zip</span>
        <span className={`material-icons ${styles.searchIcon}`} aria-hidden="true">
          location_on
        </span>
        <input
          name="loc"
          placeholder="City or Zip"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          autoComplete="off"
        />
      </label>

      <button type="submit" className={styles.searchButton}>
        GO!
      </button>
    </form>
  );
}
