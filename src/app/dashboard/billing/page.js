import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "../DashboardShell";
import styles from "../dashboard.module.css";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";
import { isMissingPrismaTableError, phase3SchemaMessage } from "@/lib/prisma-errors";

function formatPriceFromCents(priceCents) {
  return (priceCents / 100).toFixed(2);
}

/**
 * Billing and subscription management page.
 * Placeholder for Phase 6 (Stripe integration).
 */
export default async function BillingPage() {
  const session = await getCurrentSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user;

  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    redirect("/post-your-business");
  }

  let subscriptions = [];
  let plans = [];
  let schemaNotice = null;

  try {
    subscriptions = await prisma.subscription.findMany({
      where: {
        business: {
          ownerId: user.id,
        },
      },
      include: {
        business: true,
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    plans = await prisma.plan.findMany({
      orderBy: {
        priceCents: "asc",
      },
    });
  } catch (error) {
    if (!isMissingPrismaTableError(error)) {
      throw error;
    }

    schemaNotice = phase3SchemaMessage;
  }

  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "ACTIVE"
  );
  const totalMonthlySpend = activeSubscriptions.reduce(
    (sum, subscription) => sum + subscription.plan.priceCents / 100,
    0
  );

  return (
    <DashboardLayout activeTab="billing">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Billing & Subscriptions</h1>
          <p className={styles.pageSubtitle}>
            Manage your subscription plans and payment methods
          </p>
        </div>
      </div>

      {schemaNotice && (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <h2 className={styles.emptyStateTitle}>Billing Data Unavailable</h2>
            <p className={styles.emptyStateDescription}>
              {schemaNotice} Apply the schema update and billing placeholders will start loading live plan data.
            </p>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Current Spending</h2>
        <div className={styles.billingStats}>
          <div className={styles.billingStatItem}>
            <p className={styles.billingLabel}>Active Subscriptions</p>
            <p className={styles.billingValue}>{activeSubscriptions.length}</p>
          </div>
          <div className={styles.billingStatItem}>
            <p className={styles.billingLabel}>Monthly Recurring</p>
            <p className={styles.billingValue}>${totalMonthlySpend.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {activeSubscriptions.length > 0 ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Active Subscriptions</h2>
          <div className={styles.subscriptionsList}>
            {activeSubscriptions.map((subscription) => (
              <div key={subscription.id} className={styles.subscriptionItem}>
                <div>
                  <h3 className={styles.subscriptionName}>
                    {subscription.business.name}
                  </h3>
                  <p className={styles.subscriptionMeta}>
                    <strong>{subscription.plan.name}</strong>
                    {" - "}
                    ${formatPriceFromCents(subscription.plan.priceCents)}/
                    {subscription.plan.billingPeriod}
                  </p>
                  <p className={styles.subscriptionDate}>
                    {subscription.currentPeriodEnd
                      ? `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                      : "No renewal date scheduled"}
                  </p>
                </div>
                <button className={styles.subscriptionAction}>Manage</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <h3 className={styles.emptyStateTitle}>No active subscriptions</h3>
            <p className={styles.emptyStateDescription}>
              Upgrade your listings to activate paid plans
            </p>
            <Link href="/pricing" className={styles.emptyStateAction}>
              View Plans
            </Link>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Available Plans</h2>
        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <div key={plan.id} className={styles.planCard}>
              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.planPrice}>
                ${formatPriceFromCents(plan.priceCents)}
                <span className={styles.planPeriod}>/{plan.billingPeriod}</span>
              </p>
              <p className={styles.planDescription}>
                Tier {plan.tier} listing visibility and feature access.
              </p>
              <button className={styles.planButton}>
                {plan.slug === "free" ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Payment Methods</h2>
          <button className={styles.link}>+ Add Payment Method</button>
        </div>
        <div className={styles.emptyState} style={{ marginBottom: 0 }}>
          <p className={styles.emptyStateDescription}>
            Payment method management coming in Phase 6
          </p>
        </div>
      </div>

      <div
        className={styles.card}
        style={{ backgroundColor: "rgba(248, 237, 210, 0.2)" }}
      >
        <h3 className={styles.cardTitle}>Billing Information</h3>
        <ul style={{ color: "var(--muted)", lineHeight: "1.8" }}>
          <li>Month-to-month billing with no long-term contract.</li>
          <li>Charges renew automatically while the subscription stays active.</li>
          <li>Invoices are sent to the email address on your account.</li>
          <li>Payment methods and Stripe controls arrive in Phase 6.</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
