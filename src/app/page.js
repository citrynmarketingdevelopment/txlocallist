import Image from "next/image";
import styles from "./page.module.css";
import citrynGold from "../../public/citryn-gold.png";

const stack = ["Next.js 16", "React 19", "Zustand installed", "Prisma-ready"];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>Citryn Starter Repo // Authorized Chaos Only</p>
        <div className={styles.hero}>
          <div className={styles.copy}>
            <span className={styles.stamp}>Property of Citryn</span>
            <h1 className={styles.title}>PROPERTY OF CITRYN</h1>
            <p className={styles.subtitle}>
              New project smell, without the ritual sacrifice of wiring the same
              stack together for the fifteenth time.
            </p>
            <div className={styles.badges}>
              {stack.map((item) => (
                <span key={item} className={styles.badge}>
                  {item}
                </span>
              ))}
            </div>
            <div className={styles.notice}>
              <strong>Warning:</strong> unauthorized scope creep may result in
              dramatic sighing, extra tickets, and a suspicious number of
              &quot;quick fixes.&quot;
            </div>
          </div>

          <aside className={styles.card}>
            <div className={styles.imageFrame}>
              <Image
                className={styles.image}
                src={citrynGold}
                alt="Citryn Gold emblem"
                priority
                sizes="(max-width: 960px) 70vw, 420px"
              />
            </div>
            <p className={styles.caption}>
              Official golden seal of &quot;yes, this is the base repo now.&quot;
            </p>
          </aside>
        </div>

        <div className={styles.footer}>
          <code className={styles.command}>npm run dev</code>
          <p className={styles.footerText}>
            Replace the temp env values, add the schema, and pretend the hard
            part was your idea.
          </p>
        </div>
      </section>
    </main>
  );
}
