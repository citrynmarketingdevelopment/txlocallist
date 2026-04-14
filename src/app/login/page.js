import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser, getDashboardPath } from "@/lib/auth/session";

import styles from "../auth.module.css";
import { LoginForm } from "./LoginForm";

const securityBullets = [
  "Passwords are hashed with scrypt before storage.",
  "Sessions are stored server-side and sent as HTTP-only cookies.",
  "Admin routes are checked on the server for every request.",
];

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(getDashboardPath(user.role));
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.card}>
          <p className={styles.eyebrow}>TX Local List // Login</p>
          <h1 className={styles.title}>Welcome back.</h1>
          <p className={styles.lede}>
            Sign in to reach your account dashboard or the protected admin area.
          </p>

          <LoginForm />

          <p className={styles.switchText}>
            Need an account? <Link href="/signup">Create one here.</Link>
          </p>
        </div>

        <aside className={styles.sidePanel}>
          <div>
            <p className={styles.eyebrow}>Security posture</p>
            <h2>Built for actual access control, not a fake front-end gate.</h2>
            <p className={styles.sideCopy}>
              The app now uses a Prisma user table plus revocable session records,
              so auth decisions happen on the server and survive page refreshes.
            </p>
          </div>

          <ul className={styles.bulletList}>
            {securityBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          <p className={styles.sideCopy}>
            Admin accounts are seeded up front and additional admins can only be
            created from the `/admin` dashboard.
          </p>
        </aside>
      </section>
    </main>
  );
}
