import Link from "next/link";
import { Navbar, Footer } from "@/components";
import { getCurrentUser } from "@/lib/auth/session";
import styles from "./pricing.module.css";

export const metadata = {
  title: "Pricing | TX Localist",
  description:
    "Simple month-to-month pricing for Texas business listings. No contracts, cancel anytime.",
};

const PLANS = [
  {
    slug: "free",
    name: "Free",
    price: 0,
    description: "Get your name in the directory at no cost.",
    cta: "Get Started Free",
    ctaHref: "/signup?intent=owner",
    highlight: false,
    features: [
      { label: "Business name listed", included: true },
      { label: "Appears in search results", included: true },
      { label: "City & category tags", included: true },
      { label: "Contact info visible", included: false },
      { label: "Website link", included: false },
      { label: "Social links", included: false },
      { label: "Photos", value: "1 photo", included: true },
      { label: "Job postings", included: false },
      { label: "Priority search placement", included: false },
      { label: "Featured placement", included: false },
    ],
  },
  {
    slug: "starter",
    name: "Starter",
    price: 29.99,
    description: "Everything you need to get discovered and contacted.",
    cta: "Start Starter",
    ctaHref: "/signup?intent=owner&plan=starter",
    highlight: false,
    features: [
      { label: "Business name listed", included: true },
      { label: "Appears in search results", included: true },
      { label: "City & category tags", included: true },
      { label: "Contact info visible", included: true },
      { label: "Website link", included: true },
      { label: "Social links", included: false },
      { label: "Photos", value: "5 photos", included: true },
      { label: "Job postings", value: "1 active", included: true },
      { label: "Priority search placement", included: false },
      { label: "Featured placement", included: false },
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    price: 59.99,
    description: "More visibility, social presence, and hiring power.",
    cta: "Start Pro",
    ctaHref: "/signup?intent=owner&plan=pro",
    highlight: true,
    badge: "Most Popular",
    features: [
      { label: "Business name listed", included: true },
      { label: "Appears in search results", included: true },
      { label: "City & category tags", included: true },
      { label: "Contact info visible", included: true },
      { label: "Website link", included: true },
      { label: "Social links", included: true },
      { label: "Photos", value: "20 photos", included: true },
      { label: "Job postings", value: "3 active", included: true },
      { label: "Priority search placement", included: true },
      { label: "Featured placement", included: false },
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    price: 99.99,
    description: "Maximum visibility. Be featured. Dominate local search.",
    cta: "Start Premium",
    ctaHref: "/signup?intent=owner&plan=premium",
    highlight: false,
    features: [
      { label: "Business name listed", included: true },
      { label: "Appears in search results", included: true },
      { label: "City & category tags", included: true },
      { label: "Contact info visible", included: true },
      { label: "Website link", included: true },
      { label: "Social links", included: true },
      { label: "Photos", value: "50 photos", included: true },
      { label: "Job postings", value: "10 active", included: true },
      { label: "Priority search placement", included: true },
      { label: "Featured placement", included: true },
    ],
  },
];

const FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel before your next billing date and you won't be charged again. No contracts, no cancellation fees.",
  },
  {
    q: "When am I charged?",
    a: "Subscriptions renew on the 1st of each month. There is no proration for mid-month cancellations.",
  },
  {
    q: "Can I upgrade or downgrade?",
    a: "Yes. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards via Stripe. Your payment details are never stored on our servers.",
  },
  {
    q: "Is the free listing permanent?",
    a: "Yes. Your free listing stays live as long as you have an account. Upgrade whenever you're ready.",
  },
];

export default async function PricingPage() {
  const user = await getCurrentUser();
  const isOwner = user?.role === "OWNER" || user?.role === "ADMIN";

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>TX Localist // Pricing</p>
          <h1 className={styles.title}>Simple, Honest Pricing</h1>
          <p className={styles.subtitle}>
            Month-to-month plans. No setup fees. No long-term commitments.
            Cancel any time before your next billing date.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className={styles.plansSection}>
        <div className={styles.plansInner}>
          <div className={styles.plansGrid}>
            {PLANS.map((plan) => (
              <div
                key={plan.slug}
                className={`${styles.planCard} ${plan.highlight ? styles.planCardHighlight : ""}`}
              >
                {plan.badge && (
                  <span className={styles.badge}>{plan.badge}</span>
                )}
                <p className={styles.planName}>{plan.name}</p>
                <div className={styles.planPricing}>
                  <span className={styles.planPrice}>
                    ${plan.price === 0 ? "0" : plan.price.toFixed(2)}
                  </span>
                  <span className={styles.planPeriod}>/month</span>
                </div>
                <p className={styles.planDescription}>{plan.description}</p>

                <Link
                  href={isOwner ? "/dashboard/billing" : plan.ctaHref}
                  className={`${styles.planCta} ${plan.highlight ? styles.planCtaHighlight : ""}`}
                >
                  {isOwner ? "Manage Plan" : plan.cta}
                </Link>

                <ul className={styles.featureList}>
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className={`${styles.featureItem} ${!feature.included ? styles.featureItemMissing : ""}`}
                    >
                      <span className={styles.featureCheck}>
                        {feature.included ? "✓" : "✕"}
                      </span>
                      <span>
                        {feature.label}
                        {feature.value && (
                          <strong> — {feature.value}</strong>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            {FAQ.map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{item.q}</h3>
                <p className={styles.faqAnswer}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to get listed?</h2>
          <p className={styles.ctaSubtitle}>Join Texas businesses already on TX Localist.</p>
          <Link
            href={isOwner ? "/dashboard/businesses/new" : "/signup?intent=owner"}
            className={styles.ctaButton}
          >
            {isOwner ? "Create a Listing →" : "Start for Free →"}
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
