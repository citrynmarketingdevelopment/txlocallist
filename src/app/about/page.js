import Link from "next/link";

import { StaticPageLayout } from "@/components/StaticPageLayout/StaticPageLayout";
import styles from "@/components/StaticPageLayout/StaticPageLayout.module.css";

export const metadata = {
  title: "About | TX Localist",
  description: "Learn what TX Localist is building for Texas businesses and locals.",
};

export default function AboutPage() {
  return (
    <StaticPageLayout
      eyebrow="TX Localist // About"
      title="Built for people who still care about place."
      lede="TX Localist is a Texas-first directory designed to help people discover real local businesses without the clutter, ad noise, and algorithm games that bury good spots."
      ctaTitle="Ready to list your business?"
      ctaCopy="Create your listing, add your photos and hours, and start showing up for nearby locals searching for something real."
      ctaHref="/post-your-business"
      ctaLabel="Add Your Listing"
    >
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Why we made it</h2>
        <div className={styles.sectionBody}>
          <p>
            Too many directories feel packed with spam, stale information, and paid placements that
            drown out the places people actually want to support. We wanted something simpler:
            fast search, local context, and listings that feel human.
          </p>
          <p>
            TX Localist focuses on discovery for Texans first. That means easier browsing by city,
            cleaner business pages, and tools that help owners show what makes their space worth
            visiting.
          </p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>What we believe</h2>
        <div className={styles.sectionBody}>
          <ul>
            <li>Local businesses deserve visibility without having to outspend giant chains.</li>
            <li>Users should be able to browse, save, and return to places without feeling tracked.</li>
            <li>Directory pages should be useful the first time you land on them, not cluttered with junk.</li>
            <li>Texas has distinct cities, neighborhoods, and scenes, and discovery should reflect that.</li>
          </ul>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>What&apos;s next</h2>
        <div className={styles.sectionBody}>
          <p>
            We&apos;re continuing to expand local search, events, saved places, business profile depth,
            and owner tools so people can find what&apos;s nearby faster and businesses can keep their
            information current.
          </p>
          <p>
            Want to follow along or reach out directly? Visit the <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </div>
    </StaticPageLayout>
  );
}
