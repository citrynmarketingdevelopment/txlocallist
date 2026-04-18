import Link from "next/link";

import { StaticPageLayout } from "@/components/StaticPageLayout/StaticPageLayout";
import styles from "@/components/StaticPageLayout/StaticPageLayout.module.css";

export const metadata = {
  title: "How It Works | TX Localist",
  description: "See how locals browse TX Localist and how business owners get listed.",
};

export default function HowItWorksPage() {
  return (
    <StaticPageLayout
      eyebrow="TX Localist // How It Works"
      title="Search local. Save the good stuff. Show up when it matters."
      lede="TX Localist is built for two groups at once: locals trying to find great Texas businesses, and owners who want a cleaner, more useful way to be discovered."
      ctaTitle="Start exploring Texas businesses"
      ctaCopy="Browse the directory, filter by what you need, and save places you want to come back to later."
      ctaHref="/results"
      ctaLabel="Explore Listings"
    >
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>For locals</h2>
        <div className={styles.sectionBody}>
          <ul>
            <li>Search by city, category, or keyword to narrow the field fast.</li>
            <li>Open any listing to see the description, location, photos, categories, and business hours.</li>
            <li>Save your favorites to your dashboard so you can revisit them without searching again.</li>
          </ul>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>For business owners</h2>
        <div className={styles.sectionBody}>
          <ul>
            <li>Create an owner account and start a listing from the dashboard.</li>
            <li>Add the basics, choose categories, upload photos, and set weekly business hours.</li>
            <li>Publish when you&apos;re ready, then come back any time to update details as your listing evolves.</li>
          </ul>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Plans and visibility</h2>
        <div className={styles.sectionBody}>
          <p>
            Free listings help you get into the directory quickly. Paid plans unlock extra visibility,
            richer listing details, additional photos, and more owner-facing features over time.
          </p>
          <p>
            You can compare plan levels on the <Link href="/pricing">pricing page</Link>.
          </p>
        </div>
      </div>
    </StaticPageLayout>
  );
}
