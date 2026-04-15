import Link from "next/link";
import { Navbar } from "@/components";

import styles from "./dashboard.module.css";

/**
 * Dashboard wrapper layout with sidebar navigation.
 */
export function DashboardLayout({ children, activeTab = "overview" }) {
  const tabs = [
    { id: "overview", label: "Overview", href: "/dashboard" },
    { id: "businesses", label: "My Listings", href: "/dashboard/businesses" },
    { id: "billing", label: "Billing", href: "/dashboard/billing" },
    { id: "settings", label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      <Navbar />

      <div className={styles.dashboardContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Dashboard</h2>
          </div>

          <nav className={styles.sidebarNav}>
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`${styles.navLink} ${activeTab === tab.id ? styles.navLinkActive : ""}`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.helpCard}>
              <h3>Need Help?</h3>
              <p>Check out our guides and FAQs.</p>
              <a href="/help" className={styles.helpLink}>
                View Help Center →
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
