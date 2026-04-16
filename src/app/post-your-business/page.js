import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar, Footer, Button } from "@/components";
import { getCurrentUser } from "@/lib/auth/session";
import styles from "./post.module.css";

export const metadata = {
  title: "Post Your Business | TX Localist",
  description:
    "Get your Texas business listed in the most trusted local directory. Month-to-month, no contracts.",
};

const STEPS = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up free in under 2 minutes. No credit card required to get started.",
  },
  {
    number: "02",
    title: "Build Your Listing",
    description: "Add your business name, description, contact info, photos, and categories.",
  },
  {
    number: "03",
    title: "Choose a Plan",
    description: "Start free or pick a paid tier for full contact visibility and photos.",
  },
  {
    number: "04",
    title: "Go Live",
    description: "Publish your listing and start appearing in local search results instantly.",
  },
];

const BENEFITS = [
  { icon: "📍", title: "Local Visibility", description: "Appear in city and keyword searches across Texas." },
  { icon: "📞", title: "Direct Contact", description: "Let customers reach you directly — no middleman." },
  { icon: "📸", title: "Photo Gallery", description: "Showcase your space, products, or team with photos." },
  { icon: "💼", title: "Job Postings", description: "Post open positions and find local talent fast." },
  { icon: "🔗", title: "Website & Socials", description: "Link your website and social profiles to your listing." },
  { icon: "⭐", title: "Featured Placement", description: "Premium listings appear first in search results." },
];

export default async function PostYourBusinessPage() {
  const user = await getCurrentUser();

  // If already an owner, send straight to dashboard
  if (user?.role === "OWNER" || user?.role === "ADMIN") {
    redirect("/dashboard/businesses/new");
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>TX Localist // List Your Business</p>
          <h1 className={styles.heroTitle}>
            Get Found by<br />Texas Locals
          </h1>
          <p className={styles.heroSubtitle}>
            The no-nonsense Texas business directory. Month-to-month plans,
            no long-term contracts, cancel any time.
          </p>
          <div className={styles.heroActions}>
            <Link
              href={user ? "/dashboard/businesses/new" : "/signup?intent=owner"}
              className={styles.heroCta}
            >
              {user ? "Create a Listing →" : "Get Started Free →"}
            </Link>
            <Link href="/pricing" className={styles.heroSecondary}>
              View Plans & Pricing
            </Link>
          </div>
          <p className={styles.heroNote}>
            Free listing available • No credit card required to start
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Everything You Need to Get Found</h2>
          <div className={styles.benefitsGrid}>
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className={styles.benefitCard}>
                <span className={styles.benefitIcon}>{benefit.icon}</span>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.stepsSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((step) => (
              <div key={step.number} className={styles.stepCard}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tease */}
      <section className={styles.pricingTease}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Simple, Honest Pricing</h2>
          <p className={styles.sectionSubtitle}>
            Month-to-month. No setup fees. No cancellation penalties.
          </p>
          <div className={styles.teaseGrid}>
            <div className={styles.teaseCard}>
              <p className={styles.teasePlan}>Free</p>
              <p className={styles.teasePrice}>$0<span>/mo</span></p>
              <p className={styles.teaseDesc}>Name in the directory. Great for getting started.</p>
            </div>
            <div className={`${styles.teaseCard} ${styles.teaseCardHighlight}`}>
              <p className={styles.teasePlan}>Starter</p>
              <p className={styles.teasePrice}>$29.99<span>/mo</span></p>
              <p className={styles.teaseDesc}>Full contact info, website link, and 5 photos.</p>
            </div>
            <div className={styles.teaseCard}>
              <p className={styles.teasePlan}>Pro</p>
              <p className={styles.teasePrice}>$59.99<span>/mo</span></p>
              <p className={styles.teaseDesc}>Priority search, social links, and job postings.</p>
            </div>
            <div className={styles.teaseCard}>
              <p className={styles.teasePlan}>Premium</p>
              <p className={styles.teasePrice}>$99.99<span>/mo</span></p>
              <p className={styles.teaseDesc}>Featured placement, 50 photos, and everything included.</p>
            </div>
          </div>
          <Link href="/pricing" className={styles.teaseLink}>
            See Full Feature Comparison →
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.ctaTitle}>Ready to Get Listed?</h2>
          <p className={styles.ctaSubtitle}>
            Join hundreds of Texas businesses already on TX Localist.
          </p>
          <Link
            href={user ? "/dashboard/businesses/new" : "/signup?intent=owner"}
            className={styles.heroCta}
          >
            {user ? "Create a Listing →" : "Create Your Free Account →"}
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
