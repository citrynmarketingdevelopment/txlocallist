import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "../DashboardShell";
import styles from "../dashboard.module.css";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";
import { isMissingPrismaTableError, phase3SchemaMessage } from "@/lib/prisma-errors";
import { publishBusinessFormAction } from "@/app/actions/businesses";

/**
 * Dashboard businesses list page.
 * Shows all user listings with filtering and actions.
 */
export default async function BusinessesPage({ searchParams }) {
  const session = await getCurrentSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user;

  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    redirect("/post-your-business");
  }

  // Next.js 16: searchParams is a Promise
  const params = await searchParams;
  // Get status filter from query params (ACTIVE, DRAFT, PAUSED, ARCHIVED)
  const statusFilter = params?.status || null;

  // Fetch businesses
  const where = { ownerId: user.id };
  if (statusFilter) {
    where.status = statusFilter;
  }

  let businesses = [];
  let allBusinesses = [];
  let schemaNotice = null;

  try {
    businesses = await prisma.business.findMany({
      where,
      include: {
        city: true,
        plan: true,
        subscription: true,
      },
      orderBy: { createdAt: "desc" },
    });

    allBusinesses = await prisma.business.findMany({
      where: { ownerId: user.id },
    });
  } catch (error) {
    if (!isMissingPrismaTableError(error)) {
      throw error;
    }

    schemaNotice = phase3SchemaMessage;
  }

  const statusCounts = {
    ACTIVE: allBusinesses.filter((b) => b.status === "ACTIVE").length,
    DRAFT: allBusinesses.filter((b) => b.status === "DRAFT").length,
    PAUSED: allBusinesses.filter((b) => b.status === "PAUSED").length,
    ARCHIVED: allBusinesses.filter((b) => b.status === "ARCHIVED").length,
  };

  const statuses = [
    { id: null, label: "All", count: allBusinesses.length },
    { id: "ACTIVE", label: "Active", count: statusCounts.ACTIVE },
    { id: "DRAFT", label: "Draft", count: statusCounts.DRAFT },
    { id: "PAUSED", label: "Paused", count: statusCounts.PAUSED },
    { id: "ARCHIVED", label: "Archived", count: statusCounts.ARCHIVED },
  ];

  return (
    <DashboardLayout activeTab="businesses">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Listings</h1>
          <p className={styles.pageSubtitle}>
            Manage all your business listings
          </p>
        </div>
        <div className={styles.pageActions}>
          <Link href="/dashboard/businesses/new" className={styles.createButton}>
            + Create Listing
          </Link>
        </div>
      </div>

      {schemaNotice && (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <h2 className={styles.emptyStateTitle}>Listings Unavailable</h2>
            <p className={styles.emptyStateDescription}>
              {schemaNotice} Apply the Prisma schema update and this page will populate normally.
            </p>
          </div>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className={styles.filterTabs}>
        {statuses.map((status) => (
          <Link
            key={status.id || "all"}
            href={
              status.id
                ? `/dashboard/businesses?status=${status.id}`
                : `/dashboard/businesses`
            }
            className={`${styles.filterTab} ${
              statusFilter === status.id ? styles.filterTabActive : ""
            }`}
          >
            {status.label} <span className={styles.tabCount}>{status.count}</span>
          </Link>
        ))}
      </div>

      {/* Businesses List */}
      {businesses.length > 0 ? (
        <div className={styles.businessesTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCol} style={{ flex: 2 }}>
              Name
            </div>
            <div className={styles.tableCol} style={{ flex: 1 }}>
              City
            </div>
            <div className={styles.tableCol} style={{ flex: 1 }}>
              Plan
            </div>
            <div className={styles.tableCol} style={{ flex: 1 }}>
              Status
            </div>
            <div className={styles.tableCol} style={{ flex: 1 }}>
              Actions
            </div>
          </div>

          <div className={styles.tableBody}>
            {businesses.map((business) => (
              <div key={business.id} className={styles.tableRow}>
                <div className={styles.tableCol} style={{ flex: 2 }}>
                  <div>
                    <p className={styles.businessName}>{business.name}</p>
                    <p className={styles.businessMeta}>
                      {business.slug}
                    </p>
                  </div>
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  {business.city.name}
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  <span className={styles.planBadge}>
                    {business.plan.name}
                  </span>
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  <span className={styles[`status${business.status}`]}>
                    {business.status}
                  </span>
                </div>
                <div className={styles.tableCol} style={{ flex: 1 }}>
                  <div className={styles.actionButtons}>
                    {business.status === "DRAFT" && (
                      <form action={publishBusinessFormAction}>
                        <input type="hidden" name="businessId" value={business.id} />
                        <button type="submit" className={styles.publishButton}>
                          Publish
                        </button>
                      </form>
                    )}
                    <Link
                      href={`/dashboard/businesses/${business.id}/edit`}
                      className={styles.actionButton}
                    >
                      Edit
                    </Link>
                    {business.status === "ACTIVE" && (
                      <Link
                        href={`/business/${business.slug}`}
                        className={styles.actionButton}
                        target="_blank"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyStateTitle}>
            {statusFilter ? "No listings with this status" : "No listings yet"}
          </h3>
          <p className={styles.emptyStateDescription}>
            {statusFilter
              ? "Try selecting a different status filter"
              : "Create your first listing to get started"}
          </p>
          <Link href="/dashboard/businesses/new" className={styles.emptyStateAction}>
            Create Listing
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
