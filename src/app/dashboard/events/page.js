import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "../DashboardShell";
import styles from "../dashboard.module.css";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";
import { isMissingPrismaTableError } from "@/lib/prisma-errors";
import { deleteEventAction } from "@/app/actions/events";

function formatDate(val) {
  if (!val) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(val));
}

export default async function DashboardEventsPage({ searchParams }) {
  const session = await getCurrentSession();
  if (!session?.user) redirect("/login");
  const user = session.user;

  const params = await searchParams;
  const created = params?.created === "1";

  let events = [];
  let schemaNotice = null;

  try {
    events = await prisma.event.findMany({
      where: { creatorId: user.id },
      orderBy: { createdAt: "desc" },
      include: { business: { select: { name: true } } },
    });
  } catch (error) {
    if (isMissingPrismaTableError(error)) {
      schemaNotice = "The events table is not yet in the database. Run npm run db:push to apply the latest schema.";
    } else {
      throw error;
    }
  }

  return (
    <DashboardLayout activeTab="events">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Events</h1>
          <p className={styles.pageSubtitle}>Manage your local events</p>
        </div>
        <div className={styles.pageActions}>
          <Link href="/dashboard/events/new" className={styles.createButton}>
            + Create Event
          </Link>
        </div>
      </div>

      {created && (
        <div className={styles.successBanner}>
          Your event was published successfully.
        </div>
      )}

      {schemaNotice && (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <h2 className={styles.emptyStateTitle}>Events Unavailable</h2>
            <p className={styles.emptyStateDescription}>{schemaNotice}</p>
          </div>
        </div>
      )}

      {!schemaNotice && events.length === 0 && (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyStateTitle}>No events yet</h3>
          <p className={styles.emptyStateDescription}>
            Create your first event to get it listed in the directory.
          </p>
          <Link href="/dashboard/events/new" className={styles.emptyStateAction}>
            Create Event
          </Link>
        </div>
      )}

      {!schemaNotice && events.length > 0 && (
        <div className={styles.businessesTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCol} style={{ flex: 2 }}>Title</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>City</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>Date</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>Status</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>Actions</div>
          </div>
          <div className={styles.tableBody}>
            {events.map((event) => (
              <div key={event.id} className={styles.tableRow}>
                <div className={styles.tableCol} style={{ flex: 2 }}>
                  <p className={styles.businessName}>{event.title}</p>
                  {event.business && (
                    <p className={styles.businessMeta}>{event.business.name}</p>
                  )}
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  {event.city}, {event.state}
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  {formatDate(event.startDate)}
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  <span className={styles[event.status === "PUBLISHED" ? "statusACTIVE" : "statusDRAFT"]}>
                    {event.status}
                  </span>
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  <div className={styles.actionButtons}>
                    <Link href="/events" className={styles.actionButton} target="_blank">
                      View
                    </Link>
                    <form action={deleteEventAction}>
                      <input type="hidden" name="eventId" value={event.id} />
                      <button type="submit" className={styles.deleteButton}>
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
