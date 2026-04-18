import Image from "next/image";
import Link from "next/link";

import logo from "@/app/assets/Tx-Localist-01.png";
import { logoutAction } from "@/app/actions/auth";
import { getCurrentSession } from "@/lib/auth/session";

import styles from "./DashboardShell.module.css";

/**
 * Dashboard wrapper layout with a Figma-inspired sidebar shell.
 */
export async function DashboardLayout({ children, activeTab = "overview" }) {
  const session = await getCurrentSession().catch(() => null);
  const user = session?.user ?? null;
  const isOwnerView = user?.role === "OWNER" || user?.role === "ADMIN";

  const tabs = isOwnerView
    ? [
        { id: "overview", label: "Overview", href: "/dashboard", icon: "dashboard" },
        { id: "favorites", label: "Favorites", href: "/dashboard/favorites", icon: "favorite" },
        { id: "businesses", label: "My Listings", href: "/dashboard/businesses", icon: "storefront" },
        { id: "events", label: "Events", href: "/dashboard/events", icon: "event" },
        { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "payments" },
        { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
      ]
    : [{ id: "favorites", label: "Favorites", href: "/dashboard/favorites", icon: "favorite" }];

  const sectionTitles = {
    overview: "LocalDirectory",
    favorites: "Saved Places",
    businesses: "My Listings",
    events: "Events",
    billing: "Billing",
    settings: "Settings",
  };

  const userInitial = user?.email?.trim()?.charAt(0)?.toUpperCase() || "T";
  const userLabel = user?.email || "Owner account";

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.brandLink}>
              <div className={styles.brandMark}>
                <Image
                  src={logo}
                  alt="TX Local List"
                  width={56}
                  height={56}
                  className={styles.brandImage}
                  priority
                />
              </div>
              <div className={styles.brandText}>
                <p className={styles.brandTitle}>The Local Hub</p>
                <p className={styles.brandSubtitle}>Business portal</p>
              </div>
            </Link>
          </div>

          <Link
            href={isOwnerView ? "/dashboard/businesses/new" : "/results"}
            className={styles.sidebarCta}
          >
            {isOwnerView ? "Add New Listing" : "Explore Local Spots"}
          </Link>

          <nav className={styles.sidebarNav}>
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`${styles.navLink} ${activeTab === tab.id ? styles.navLinkActive : ""}`}
              >
                <span className={`material-icons ${styles.navLinkIcon}`} aria-hidden="true">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </Link>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.helpCard}>
              <p className={styles.helpEyebrow}>{isOwnerView ? "Upgrade to Pro" : "Build Your Local List"}</p>
              <p className={styles.helpText}>
                {isOwnerView
                  ? "Get 2x more visibility across the region."
                  : "Save places you love and come back to them any time."}
              </p>
            </div>
          </div>
        </aside>

        <section className={styles.mainPane}>
          <header className={styles.topbar}>
            <div>
              <p className={styles.topbarTitle}>{sectionTitles[activeTab] || "Dashboard"}</p>
            </div>

            <div className={styles.topbarActions}>
              <button type="button" className={styles.notificationButton} aria-label="Notifications">
                <span className="material-icons" aria-hidden="true">
                  notifications_none
                </span>
              </button>

              <div className={styles.profilePill}>
                <div className={styles.profileAvatar}>{userInitial}</div>
                <div className={styles.profileText}>
                  <span className={styles.profileEmail}>{userLabel}</span>
                  <span className={styles.profileRole}>{user?.role || "OWNER"}</span>
                </div>
              </div>

              <form action={logoutAction} className={styles.logoutForm}>
                <button type="submit" className={styles.logoutButton}>
                  <span className="material-icons" aria-hidden="true">
                    logout
                  </span>
                  <span>Log out</span>
                </button>
              </form>
            </div>
          </header>

          <main className={styles.mainContent}>{children}</main>
        </section>
      </div>
    </div>
  );
}
