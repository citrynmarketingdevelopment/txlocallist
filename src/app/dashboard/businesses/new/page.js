import { redirect } from "next/navigation";
import { DashboardLayout } from "../../DashboardLayout";
import { CreateBusinessForm } from "./CreateBusinessForm";
import styles from "../../dashboard.module.css";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";
import { isMissingPrismaTableError, phase3SchemaMessage } from "@/lib/prisma-errors";

/**
 * New business creation page.
 */
export default async function NewBusinessPage() {
  const session = await getCurrentSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user;

  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    redirect("/post-your-business");
  }

  let cities = [];
  let categories = [];
  let schemaNotice = null;

  try {
    [cities, categories] = await Promise.all([
      prisma.city.findMany({ orderBy: { name: "asc" } }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch (error) {
    if (!isMissingPrismaTableError(error)) {
      throw error;
    }

    schemaNotice = phase3SchemaMessage;
  }

  return (
    <DashboardLayout activeTab="businesses">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Create a New Listing</h1>
          <p className={styles.pageSubtitle}>
            Add your business to the TX Localist directory
          </p>
        </div>
      </div>

      {schemaNotice ? (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <h2 className={styles.emptyStateTitle}>Form Not Ready Yet</h2>
            <p className={styles.emptyStateDescription}>
              {schemaNotice} Once the database is updated, the city and category options will appear here.
            </p>
          </div>
        </div>
      ) : (
        <CreateBusinessForm cities={cities} categories={categories} />
      )}
    </DashboardLayout>
  );
}
