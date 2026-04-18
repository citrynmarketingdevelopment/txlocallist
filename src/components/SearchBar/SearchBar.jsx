"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";

export default function SearchBar({
  action = "/results",
  initialQuery = "",
  initialLocation = "",
  defaultLocation = "Austin, TX",
  initialType = "businesses",
  variant = "hero",
  onSubmit,
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation || defaultLocation);
  const [type, setType] = useState(initialType);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setLocation(initialLocation || defaultLocation);
  }, [defaultLocation, initialLocation]);

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  function submit() {
    if (onSubmit) {
      onSubmit({ query, location, type });
      return;
    }

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("loc", location);
    params.set("tab", type);
    router.push(action + "?" + params.toString());
  }

  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  return (
    <form
      className={[styles.pill, variant === "hero" ? styles.hero : styles.inline].join(" ")}
      onSubmit={handleSubmit}
    >
      <div className={styles.queryWrap}>
        <span className={"material-icons " + styles.queryIcon}>search</span>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search spots, festivals, or towns..."
          autoComplete="off"
          className={styles.queryInput}
          name="q"
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.locationWrap}>
        <span className={"material-icons " + styles.locationIcon}>location_on</span>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="City or Zip"
          autoComplete="off"
          className={styles.locationInput}
          name="loc"
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.actionsGroup}>
        <div className={styles.typeGroup} role="group" aria-label="Search type">
          <button
            type="button"
            onClick={() => setType("businesses")}
            aria-pressed={type === "businesses"}
            className={[styles.typeBtn, type === "businesses" ? styles.bizActive : ""].join(" ")}
          >
            <span className={"material-icons " + styles.typeBtnIcon}>storefront</span>
            Local Businesses
          </button>

          <button
            type="button"
            onClick={() => setType("events")}
            aria-pressed={type === "events"}
            className={[styles.typeBtn, type === "events" ? styles.evtActive : ""].join(" ")}
          >
            <span className={"material-icons " + styles.typeBtnIcon}>event</span>
            Local Events
          </button>
        </div>

        <button type="submit" className={styles.searchBtn}>
          <span className={"material-icons " + styles.searchBtnIcon}>search</span>
          Search
        </button>
      </div>
    </form>
  );
}
