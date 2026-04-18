"use client";

import { useMemo, useState } from "react";

import styles from "./suggest-business.module.css";

function buildMailtoUrl({ businessName, city, website, notes, email }) {
  const subject = `Business suggestion: ${businessName || "New local spot"}`;
  const body = [
    "Hi TX Localist,",
    "",
    "I'd like to suggest a business for the directory.",
    "",
    `Business name: ${businessName || ""}`,
    `City / area: ${city || ""}`,
    `Website or socials: ${website || ""}`,
    `Why it belongs: ${notes || ""}`,
    `My email: ${email || ""}`,
  ].join("\n");

  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:hello@txlocalist.com?${params.toString()}`;
}

export function SuggestBusinessForm({ initialName = "", initialCity = "" }) {
  const [businessName, setBusinessName] = useState(initialName);
  const [city, setCity] = useState(initialCity);
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const mailtoUrl = useMemo(
    () => buildMailtoUrl({ businessName, city, website, notes, email }),
    [businessName, city, website, notes, email]
  );

  function handleSubmit(event) {
    event.preventDefault();

    if (!businessName.trim()) {
      setError("Add the business name so we know what to review.");
      return;
    }

    if (!city.trim()) {
      setError("Add the city or area so we know where it belongs.");
      return;
    }

    setError("");
    setSubmitted(true);
    window.location.href = mailtoUrl;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error ? <div className={styles.errorBanner}>{error}</div> : null}
      {submitted ? (
        <div className={styles.successBanner}>
          Your email app should open with the suggestion pre-filled. If it doesn&apos;t, use the direct link below.
        </div>
      ) : null}

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Business name</span>
          <input
            type="text"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            className={styles.input}
            placeholder="Example: Little Corner Books"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>City or area</span>
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className={styles.input}
            placeholder="Austin, TX"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Website or social link</span>
        <input
          type="url"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className={styles.input}
          placeholder="https://example.com"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Why should it be listed?</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className={styles.textarea}
          rows={5}
          placeholder="Tell us what makes this spot worth knowing about."
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Your email (optional)</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={styles.input}
          placeholder="you@example.com"
        />
      </label>

      <div className={styles.actions}>
        <button type="submit" className={styles.primaryButton}>
          Send Suggestion
        </button>
        <a href={mailtoUrl} className={styles.secondaryButton}>
          Open Email Directly
        </a>
      </div>
    </form>
  );
}
