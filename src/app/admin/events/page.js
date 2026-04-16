import { AdminShell } from "../AdminShell";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { isMissingPrismaTableError } from "@/lib/prisma-errors";
import { adminDeleteEventAction } from "@/app/actions/admin";
import styles from "@/app/dashboard/dashboard.module.css";

function formatDate(val) {
  if (!val) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(val));
}

export default async function AdminEventsPage() {
  await requireAdmin();

  let events = [];
  let schemaNotice = null;

  try {
    events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: { select: { email: true } },
        business: { select: { name: true } },
      },
    });
  } catch (err) {
    if (isMissingPrismaTableError(err)) schemaNotice = "Run npm run db:push to enable events.";
    else throw err;
  }

  return (
    <AdminShell activeTab="events">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>All Events</h1>
          <p className={styles.pageSubtitle}>Review and moderate platform events</p>
        </div>
      </div>

      {schemaNotice && <p style={{ color: "var(--retro-red)", marginBottom: "1rem" }}>{schemaNotice}</p>}

      {events.length === 0 && !schemaNotice && (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyStateTitle}>No events yet</h3>
        </div>
      )}

      {events.length > 0 && (
        <div className={styles.businessesTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCol} style={{ flex: 2 }}>Title</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>Creator</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>City</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>Date</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>Status</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>Actions</div>
          </div>
          <div className={styles.tableBody}>
            {events.map((e) => (
              <div key={e.id} className={styles.tableRow}>
                <div className={styles.tableCol} style={{ flex: 2 }}>
                  <p className={styles.businessName}>{e.title}</p>
                  {e.business && <p className={styles.businessMeta}>{e.business.name}</p>}
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  <p className={styles.businessMeta}>{e.creator.email}</p>
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>{e.city}</div>
                <div className={styles.tableCol} style={{ flex: 1 }}>{formatDate(e.startDate)}</div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  <span className={e.status === "PUBLISHED" ? styles.statusACTIVE : styles.statusDRAFT}>
                    {e.status}
                  </span>
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  <form action={adminDeleteEventAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <button type="submit" className={styles.deleteButton}>Delete</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
