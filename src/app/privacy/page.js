import Link from "next/link";

import { StaticPageLayout } from "@/components/StaticPageLayout/StaticPageLayout";
import styles from "@/components/StaticPageLayout/StaticPageLayout.module.css";

export const metadata = {
  title: "Privacy Policy | TX Localist",
  description: "Read how TX Localist handles account, session, and listing data.",
};

export default function PrivacyPage() {
  return (
    <StaticPageLayout
      eyebrow="TX Localist // Privacy"
      title="Privacy Policy"
      lede="This page explains what information TX Localist collects, how it is used, and the choices you have around your account and submitted content."
      ctaTitle="Need help with a privacy request?"
      ctaCopy="Send us the details and we will follow up as quickly as we can."
      ctaHref="/contact"
      ctaLabel="Get in Touch"
    >
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>What we collect</h2>
        <div className={styles.sectionBody}>
          <ul>
            <li>Account details such as email address, password hash, role, and session records.</li>
            <li>Business listing details you submit, including descriptions, images, contact info, and hours.</li>
            <li>Activity connected to account features, such as saved favorites and dashboard actions.</li>
          </ul>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>How we use information</h2>
        <div className={styles.sectionBody}>
          <p>
            We use submitted information to operate the directory, authenticate accounts, display
            listings, improve search and browsing features, and communicate about platform activity.
          </p>
          <p>
            We may also use aggregated, non-identifying information to understand how people use the
            site and where we should improve the product next.
          </p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Cookies and sessions</h2>
        <div className={styles.sectionBody}>
          <p>
            TX Localist uses secure session cookies to keep you signed in. Those cookies are used for
            authentication and core product behavior, not to power third-party ad tracking.
          </p>
          <p>
            You can sign out at any time, and you can also clear cookies in your browser if you want
            to remove session data from your device.
          </p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Sharing and requests</h2>
        <div className={styles.sectionBody}>
          <p>
            We do not sell your personal information. We may share information with service providers
            that help us run the platform, or when required by law.
          </p>
          <p>
            If you need to request account assistance or ask a privacy question, use the <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </div>
    </StaticPageLayout>
  );
}
