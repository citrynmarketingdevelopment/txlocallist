import Link from "next/link";
import { AdminShell } from "../AdminShell";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { isMissingPrismaTableError } from "@/lib/prisma-errors";
import { suspendBusinessAction, activateBusinessAction, archiveBusinessAction } from "@/app/actions/admin";
import styles from "@/app/dashboard/dashboard.module.css";

function formatDate(val) {
  if (!val) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(val));
}

export default async function AdminBusinessesPage({ searchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const statusFilter = params?.status || null;

  let businesses = [];
  let counts = { ALL: 0, ACTIVE: 0, DRAFT: 0, PAUSED: 0, SUSPENDED: 0, ARCHIVED: 0 };
  let schemaNotice = null;

  try {
    const where = statusFilter ? { status: statusFilter } : {};
    [businesses] = await Promise.all([
      prisma.business.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { city: true, owner: { select: { email: true } }, plan: true },
      }),
    ]);
    const all = await prisma.business.findMany({ select: { status: true } });
    counts.ALL = all.length;
    for (const b of all) counts[b.status] = (counts[b.status] || 0) + 1;
  } catch (err) {
    if (isMissingPrismaTableError(err)) schemaNotice = "Run npm run db:push to sync schema.";
    else throw err;
  }

  const tabs = [
    { id: null,         label: "All",       count: counts.ALL },
    { id: "ACTIVE",     label: "Active",    count: counts.ACTIVE },
    { id: "DRAFT",      label: "Draft",     count: counts.DRAFT },
    { id: "SUSPENDED",  label: "Suspended", count: counts.SUSPENDED },
    { id: "ARCHIVED",   label: "Archived",  count: counts.ARCHIVED },
  ];

  return (
    <AdminShell activeTab="businesses">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>All Listings</h1>
          <p className={styles.pageSubtitle}>Moderate business listings across the platform</p>
        </div>
      </div>

      {schemaNotice && <p style={{ color: "var(--retro-red)" }}>{schemaNotice}</p>}

      <div className={styles.filterTabs}>
        {tabs.map((t) => (
          <Link
            key={t.id ?? "all"}
            href={t.id ? `/admin/businesses?status=${t.id}` : "/admin/businesses"}
            className={`${styles.filterTab} ${statusFilter === t.id ? styles.filterTabActive : ""}`}
          >
            {t.label} <span className={styles.tabCount}>{t.count}</span>
          </Link>
        ))}
      </div>

      {businesses.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyStateTitle}>No listings found</h3>
        </div>
      ) : (
        <div className={styles.businessesTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCol} style={{ flex: 2 }}>Business</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>Owner</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>City</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>Plan</div>
            <div className={styles.tableCol} style={{ flex: 1 }}>Status</div>
            <div className={styles.tableCol} style={{ flex: 1.5 }}>Actions</div>
          </div>
          <div className={styles.tableBody}>
            {businesses.map((b) => (
              <div key={b.id} className={styles.tableRow}>
                <div className={styles.tableCol} style={{ flex: 2 }}>
                  <p className={styles.businessName}>{b.name}</p>
                  <p className={styles.businessMeta}>{b.slug}</p>
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  <p className={styles.businessMeta}>{b.owner.email}</p>
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>{b.city?.name ?? "—"}</div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  <span className={styles.planBadge}>{b.plan?.name ?? "Free"}</span>
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  <span className={styles["status" + b.status]}>{b.status}</span>
                </div>
                <div className={styles.tableCol} style={{ flex: 1.5 }}>
                  <div className={styles.actionButtons}>
                    {b.status !== "ACTIVE" && b.status !== "ARCHIVED" && (
                      <form action={activateBusinessAction}>
                        <input type="hidden" name="id" value={b.id} />
                        <button type="submit" className={styles.publishButton}>Activate</button>
                      </form>
                    )}
                    {b.status === "ACTIVE" && (
                      <form action={suspendBusinessAction}>
                        <input type="hidden" name="id" value={b.id} />
                        <button type="submit" className={styles.deleteButton}>Suspend</button>
                      </form>
                    )}
                    {b.status !== "ARCHIVED" && (
                      <form action={archiveBusinessAction}>
                        <input type="hidden" name="id" value={b.id} />
                        <button type="submit" className={styles.deleteButton} style={{ opacity: 0.6 }}>Archive</button>
                      </form>
                    )}
                    {b.status === "ACTIVE" && (
                      <Link href={"/business/" + b.slug} className={styles.actionButton} target="_blank">View</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
