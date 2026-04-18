import Link from "next/link";

import { Footer, Navbar } from "@/components";

import styles from "./StaticPageLayout.module.css";

export function StaticPageLayout({
  eyebrow,
  title,
  lede,
  children,
  ctaTitle,
  ctaCopy,
  ctaHref,
  ctaLabel,
}) {
  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.lede}>{lede}</p>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.contentInner}>{children}</div>
        </section>

        {ctaTitle && ctaCopy && ctaHref && ctaLabel ? (
          <section className={styles.ctaSection}>
            <div className={styles.ctaCard}>
              <div>
                <p className={styles.ctaEyebrow}>Keep it local</p>
                <h2 className={styles.ctaTitle}>{ctaTitle}</h2>
                <p className={styles.ctaCopy}>{ctaCopy}</p>
              </div>

              <Link href={ctaHref} className={styles.ctaButton}>
                {ctaLabel}
              </Link>
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
