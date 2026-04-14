import Image from "next/image";
import Link from "next/link";

import { logoutAction } from "@/app/actions/auth";
import { getCurrentUser, getDashboardPath } from "@/lib/auth/session";

import styles from "./page.module.css";
import citrynGold from "../../public/citryn-gold.png";

const securityFeatures = [
  "Passwords are hashed with scrypt before they ever touch the database.",
  "Sessions use opaque HTTP-only cookies backed by hashed tokens in Prisma.",
  "Admin access is gated by role checks on the server, not just in the UI.",
];

const adminFeatures = [
  "Protected `/admin` route with role-based access control.",
  "User counts, admin counts, active sessions, and recent signups at a glance.",
  "Seed one initial admin, then create any future admins from the dashboard.",
];

export default async function Home() {
  const user = await getCurrentUser();
  const dashboardPath = user ? getDashboardPath(user.role) : null;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.heroPanel}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>TX Local List // Secure Access Layer</p>
            <span className={styles.stamp}>Next.js + Prisma auth stack</span>
            <h1 className={styles.title}>Login, Signup, and Admin Control in One Pass.</h1>
            <p className={styles.subtitle}>
              The app now supports user registration, secure password login,
              database-backed sessions, and a role-gated admin dashboard that
              lives behind server-enforced access control.
            </p>

            <div className={styles.actions}>
              {user ? (
                <>
                  <Link href={dashboardPath} className={styles.primaryLink}>
                    Open {user.role === "ADMIN" ? "admin dashboard" : "dashboard"}
                  </Link>
                  <Link href="/events" className={styles.secondaryLink}>
                    Browse events
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className={styles.ghostButton}>
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/signup" className={styles.primaryLink}>
                    Create an account
                  </Link>
                  <Link href="/events" className={styles.secondaryLink}>
                    Browse events
                  </Link>
                  <Link href="/login" className={styles.secondaryLink}>
                    Log in
                  </Link>
                </>
              )}
            </div>

            <div className={styles.badges}>
              <span className={styles.badge}>Prisma-backed users</span>
              <span className={styles.badge}>Scrypt password hashing</span>
              <span className={styles.badge}>HTTP-only cookie sessions</span>
              <span className={styles.badge}>Public events directory</span>
              <span className={styles.badge}>Role-based admin dashboard</span>
            </div>

            <div className={styles.notice}>
              <strong>Access model:</strong> regular users land in `/dashboard`,
              while admin users are routed to `/admin` with server-side
              authorization checks on each request.
            </div>
          </div>

          <aside className={styles.visualCard}>
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
              Signed-in sessions are stored as hashed database records, so you
              can revoke them server-side instead of trusting a client-issued
              token forever.
            </p>
          </aside>
        </div>

        <div className={styles.grid}>
          <section className={styles.featureCard}>
            <p className={styles.cardEyebrow}>Security</p>
            <h2 className={styles.cardTitle}>What is protected</h2>
            <ul className={styles.list}>
              {securityFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>

          <section className={styles.featureCard}>
            <p className={styles.cardEyebrow}>Admin</p>
            <h2 className={styles.cardTitle}>What the dashboard includes</h2>
            <ul className={styles.list}>
              {adminFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}
