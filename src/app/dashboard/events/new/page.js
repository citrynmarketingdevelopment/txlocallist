import { redirect } from "next/navigation";
import { DashboardLayout } from "../../DashboardShell";
import { CreateEventForm } from "./CreateEventForm";
import styles from "../../dashboard.module.css";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";
import { isMissingPrismaTableError } from "@/lib/prisma-errors";

export default async function NewEventPage() {
  const session = await getCurrentSession();
  if (!session?.user) redirect("/login");
  const user = session.user;

  let businesses = [];
  let schemaNotice = null;

  try {
    businesses = await prisma.business.findMany({
      where: { ownerId: user.id, status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    if (isMissingPrismaTableError(error)) {
      schemaNotice = "The database schema is not ready. Run npm run db:push and reload.";
    } else {
      throw error;
    }
  }

  return (
    <DashboardLayout activeTab="events">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Create Event</h1>
          <p className={styles.pageSubtitle}>Post a local event to the directory</p>
        </div>
      </div>

      {schemaNotice ? (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <h2 className={styles.emptyStateTitle}>Schema Not Ready</h2>
            <p className={styles.emptyStateDescription}>{schemaNotice}</p>
          </div>
        </div>
      ) : (
        <div className={styles.card}>
          <CreateEventForm businesses={businesses} />
        </div>
      )}
    </DashboardLayout>
  );
}
