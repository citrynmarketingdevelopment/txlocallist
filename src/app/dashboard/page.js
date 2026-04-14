import Link from "next/link";

import { logoutAction } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

import styles from "../portal.module.css";

function formatDate(value) {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function DashboardPage() {
  const user = await requireUser();
  const [activeSessions, eventCount, recentEvents] = await Promise.all([
    prisma.session.count({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
      },
    }),
    prisma.event.count({
      where: {
        creatorId: user.id,
      },
    }),
    prisma.event.findMany({
      where: {
        creatorId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        city: true,
        state: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>TX Local List // Account Dashboard</p>
          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.title}>Your secure account area.</h1>
              <p className={styles.copy}>
                Signed in as {user.email}. This route is protected on the server
                and only renders for authenticated users.
              </p>
            </div>

            <div className={styles.actions}>
              {user.role === "ADMIN" ? (
                <Link href="/admin" className={styles.primaryLink}>
                  Open admin dashboard
                </Link>
              ) : null}
              <Link href="/dashboard/events/new" className={styles.primaryLink}>
                Create event
              </Link>
              <Link href="/events" className={styles.secondaryLink}>
                Browse events
              </Link>
              <Link href="/" className={styles.secondaryLink}>
                Back home
              </Link>
              <form action={logoutAction}>
                <button type="submit" className={styles.ghostButton}>
                  Log out
                </button>
              </form>
            </div>
          </div>
        </header>

        <section className={styles.cardGrid}>
          <article className={styles.card}>
            <p className={styles.cardLabel}>Role</p>
            <p className={styles.cardValue}>{user.role}</p>
            <p className={styles.cardNote}>
              Your role decides which protected routes you can access.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.cardLabel}>Active sessions</p>
            <p className={styles.cardValue}>{activeSessions}</p>
            <p className={styles.cardNote}>
              Sessions are stored in the database and can be revoked server-side.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.cardLabel}>Last sign-in</p>
            <p className={styles.cardValue}>{user.lastLoginAt ? "Tracked" : "New"}</p>
            <p className={styles.cardNote}>{formatDate(user.lastLoginAt)}</p>
          </article>

          <article className={styles.card}>
            <p className={styles.cardLabel}>Events published</p>
            <p className={styles.cardValue}>{eventCount}</p>
            <p className={styles.cardNote}>
              Create and manage your local event listings from this account.
            </p>
          </article>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Account details</h2>
              <p className={styles.sectionCopy}>
                This is server-rendered from Prisma using the current session.
              </p>
            </div>
          </div>

          <div className={styles.detailList}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>{user.email}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Role</span>
              <span className={styles.detailValue}>{user.role}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Joined</span>
              <span className={styles.detailValue}>{formatDate(user.createdAt)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Last sign-in</span>
              <span className={styles.detailValue}>{formatDate(user.lastLoginAt)}</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Recent events</h2>
              <p className={styles.sectionCopy}>
                Your latest published events, ready for the public events page.
              </p>
            </div>
          </div>

          {recentEvents.length === 0 ? (
            <p className={styles.emptyState}>
              You have not published any events yet. Start with the create event
              flow.
            </p>
          ) : (
            <div className={styles.detailList}>
              {recentEvents.map((event) => (
                <div key={event.id} className={styles.detailRow}>
                  <span className={styles.detailLabel}>{event.title}</span>
                  <span className={styles.detailValue}>
                    {event.city}, {event.state} | {formatDate(event.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
