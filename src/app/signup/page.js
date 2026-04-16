import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser, getDashboardPath } from "@/lib/auth/session";

import styles from "../auth.module.css";
import { SignupForm } from "./SignupForm";

const ownerBullets = [
  "Your listing goes live the same day you sign up.",
  "Month-to-month billing — cancel any time, no questions asked.",
  "Appear in city + keyword searches across Texas immediately.",
];

const defaultBullets = [
  "User accounts are stored securely with hashed passwords.",
  "Successful signup starts a secure HTTP-only session immediately.",
  "Browse, save, and search local Texas businesses right away.",
];

export default async function SignupPage({ searchParams }) {
  const user = await getCurrentUser();

  if (user) {
    redirect(getDashboardPath(user.role));
  }

  const params = await searchParams;
  const intent = params?.intent ?? "";
  const isOwner = intent === "owner";

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.card}>
          <p className={styles.eyebrow}>TX Local List // {isOwner ? "List Your Business" : "Sign Up"}</p>
          <h1 className={styles.title}>
            {isOwner ? "Create your owner account." : "Create your account."}
          </h1>
          <p className={styles.lede}>
            {isOwner
              ? "Set up your owner account and build your first listing in minutes."
              : "Register an account and start discovering local Texas businesses."}
          </p>

          <SignupForm intent={intent} />

          <p className={styles.switchText}>
            Already have an account? <Link href="/login">Log in here.</Link>
          </p>
        </div>

        <aside className={styles.sidePanel}>
          <div>
            <p className={styles.eyebrow}>What happens next</p>
            <h2>
              {isOwner
                ? "You're minutes away from your first listing."
                : "The signup flow is tied directly into the access model."}
            </h2>
            <p className={styles.sideCopy}>
              {isOwner
                ? "After creating your account you'll be taken straight to the listing builder. Fill in your details, pick a plan, and go live."
                : "New users are created in the database and redirected to their dashboard after signup."}
            </p>
          </div>

          <ul className={styles.bulletList}>
            {(isOwner ? ownerBullets : defaultBullets).map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          {isOwner && (
            <p className={styles.sideCopy}>
              Want to see pricing first?{" "}
              <Link href="/pricing">View all plans →</Link>
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}
