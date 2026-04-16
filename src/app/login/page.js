import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser, getDashboardPath } from "@/lib/auth/session";
import landscapeImage from "@/app/assets/vintage Texas landscape.png";
import logoImage from "@/app/assets/Tx-Localist-04.png";

import styles from "./login.module.css";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(getDashboardPath(user.role));
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.brandPanel}>
          <div className={styles.brandInner}>
            <Image
              src={logoImage}
              alt="Localist"
              className={styles.logo}
              priority
            />
            <p className={styles.brandBadge}>Local Director</p>
            <h1 className={styles.heroTitle}>Skip the noise. Get back to local.</h1>
            <div className={styles.landscapeFrame}>
              <Image
                src={landscapeImage}
                alt="Vintage Texas landscape"
                className={styles.landscapeImage}
                priority
              />
            </div>
          </div>
          <div className={styles.decorOrb} aria-hidden="true"></div>
        </div>

        <aside className={styles.authPanel}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h2 className={styles.authTitle}>Login</h2>
              <span className={`material-icons ${styles.authFingerprint}`} aria-hidden="true">
                fingerprint
              </span>
            </div>

            <LoginForm />

            <div className={styles.authDivider}>
              <span>External secure</span>
            </div>

            <p className={styles.authFooter}>
              Looking to list your space?{" "}
              <Link href="/signup?intent=owner" className={styles.authFooterLink}>
                Sign up for a business account
              </Link>
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
