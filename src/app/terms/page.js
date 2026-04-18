import Link from "next/link";

import { StaticPageLayout } from "@/components/StaticPageLayout/StaticPageLayout";
import styles from "@/components/StaticPageLayout/StaticPageLayout.module.css";

export const metadata = {
  title: "Terms of Service | TX Localist",
  description: "Read the core terms that govern use of TX Localist.",
};

export default function TermsPage() {
  return (
    <StaticPageLayout
      eyebrow="TX Localist // Terms"
      title="Terms of Service"
      lede="These terms govern your access to and use of TX Localist. By using the site, creating an account, or submitting a listing, you agree to follow them."
      ctaTitle="Questions about these terms?"
      ctaCopy="If something here is unclear, reach out and we can point you in the right direction."
      ctaHref="/contact"
      ctaLabel="Contact Us"
    >
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Using the service</h2>
        <div className={styles.sectionBody}>
          <p>
            You agree to use TX Localist lawfully and not attempt to interfere with the platform,
            scrape restricted data, abuse account access, or submit false or misleading information.
          </p>
          <p>
            We may suspend or remove accounts, listings, events, or submissions that violate these
            terms or create risk for the platform or other users.
          </p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Listings and user content</h2>
        <div className={styles.sectionBody}>
          <p>
            You are responsible for the content you submit, including business descriptions, images,
            contact information, links, and hours. By submitting content, you confirm you have the
            right to share it and give us permission to display it on the service.
          </p>
          <p>
            We may edit, reject, unpublish, or remove content that is inaccurate, unlawful, abusive,
            infringing, or otherwise inconsistent with the platform.
          </p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Plans, payments, and changes</h2>
        <div className={styles.sectionBody}>
          <p>
            Paid plans, billing tools, and related features may change over time. When billing is active,
            charges, renewal timing, and cancellation rules will be presented during the subscription flow.
          </p>
          <p>
            We may update, pause, or discontinue portions of TX Localist at any time. Continued use after
            material updates means you accept the revised terms.
          </p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Disclaimers and limits</h2>
        <div className={styles.sectionBody}>
          <p>
            TX Localist is provided on an &quot;as is&quot; basis. We do not guarantee uninterrupted access,
            listing accuracy, search ranking outcomes, or business availability.
          </p>
          <p>
            To the fullest extent allowed by law, TX Localist is not liable for indirect, incidental,
            or consequential damages arising from use of the platform. Your use of the service is at
            your own risk.
          </p>
          <p>
            For privacy-related details, review our <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </StaticPageLayout>
  );
}
