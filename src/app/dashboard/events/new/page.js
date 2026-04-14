import Link from "next/link";

import { logoutAction } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

import styles from "@/app/portal.module.css";
import { CreateEventForm } from "./CreateEventForm";

export default async function NewEventPage() {
  const user = await requireUser();
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>TX Local List // Create Event</p>
          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.title}>Publish a local event.</h1>
              <p className={styles.copy}>
                Signed in as {user.email}. Add the event details, choose tags,
                and publish it to the public events directory.
              </p>
            </div>

            <div className={styles.actions}>
              <Link href="/events" className={styles.primaryLink}>
                Browse events
              </Link>
              <Link href="/dashboard" className={styles.secondaryLink}>
                Back to dashboard
              </Link>
              <form action={logoutAction}>
                <button type="submit" className={styles.ghostButton}>
                  Log out
                </button>
              </form>
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Event details</h2>
              <p className={styles.sectionCopy}>
                Required fields include the event image, location data, and at
                least one admin-managed tag.
              </p>
            </div>
          </div>

          {tags.length === 0 ? (
            <p className={styles.emptyState}>
              No event tags exist yet. Run the seed script so users have tags to
              assign when creating events.
            </p>
          ) : (
            <CreateEventForm tags={tags} />
          )}
        </section>
      </section>
    </main>
  );
}
