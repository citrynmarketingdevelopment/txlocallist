import Link from "next/link";

import { StaticPageLayout } from "@/components/StaticPageLayout/StaticPageLayout";
import styles from "@/components/StaticPageLayout/StaticPageLayout.module.css";

export const metadata = {
  title: "Contact | TX Localist",
  description: "Contact TX Localist for general questions, listings, and privacy requests.",
};

export default function ContactPage() {
  return (
    <StaticPageLayout
      eyebrow="TX Localist // Contact"
      title="Let&apos;s talk."
      lede="Need help with a listing, have a general question, or want to report something that needs attention? Reach out and we&apos;ll point you to the right next step."
      ctaTitle="Want to get listed instead?"
      ctaCopy="If you already know you want your business in the directory, skip the inbox and start your listing."
      ctaHref="/post-your-business"
      ctaLabel="Start a Listing"
    >
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>General support</h2>
        <div className={styles.sectionBody}>
          <p>
            Email <a href="mailto:hello@txlocalist.com">hello@txlocalist.com</a> for general questions,
            directory issues, or account help.
          </p>
          <p>
            If you&apos;re writing about a specific listing, include the business name and city so we can
            help faster.
          </p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Business and partnership inquiries</h2>
        <div className={styles.sectionBody}>
          <p>
            For listing questions, plan upgrades, or partnership ideas, email{" "}
            <a href="mailto:hello@txlocalist.com?subject=Business%20Inquiry">hello@txlocalist.com</a>.
          </p>
          <p>
            You can also review the <Link href="/how-it-works">How It Works</Link> page before reaching out.
          </p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Privacy and legal</h2>
        <div className={styles.sectionBody}>
          <p>
            For privacy requests or legal notices, send an email to{" "}
            <a href="mailto:hello@txlocalist.com?subject=Privacy%20Request">hello@txlocalist.com</a> with
            the subject line that best matches your request.
          </p>
          <p>
            You can review the current <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link> any time.
          </p>
        </div>
      </div>
    </StaticPageLayout>
  );
}
