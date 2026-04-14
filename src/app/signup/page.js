import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser, getDashboardPath } from "@/lib/auth/session";

import styles from "../auth.module.css";
import { SignupForm } from "./SignupForm";

const onboardingBullets = [
  "User accounts are stored in Prisma with unique email addresses.",
  "Successful signup starts a secure HTTP-only session immediately.",
  "Public signup only creates standard user accounts.",
];

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(getDashboardPath(user.role));
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.card}>
          <p className={styles.eyebrow}>TX Local List // Signup</p>
          <h1 className={styles.title}>Create your account.</h1>
          <p className={styles.lede}>
            Register a standard user account and start a secure session
            immediately.
          </p>

          <SignupForm />

          <p className={styles.switchText}>
            Already have an account? <Link href="/login">Log in here.</Link>
          </p>
        </div>

        <aside className={styles.sidePanel}>
          <div>
            <p className={styles.eyebrow}>What happens next</p>
            <h2>The signup flow is tied directly into the access model.</h2>
            <p className={styles.sideCopy}>
              New users are created in the database as standard users and then
              redirected into their protected dashboard.
            </p>
          </div>

          <ul className={styles.bulletList}>
            {onboardingBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          <p className={styles.sideCopy}>
            Admin accounts are seeded separately and can only create additional
            admins from the `/admin` dashboard.
          </p>
        </aside>
      </section>
    </main>
  );
}
