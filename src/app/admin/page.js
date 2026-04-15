import Link from "next/link";

import { logoutAction } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { isMissingPrismaTableError, phase3SchemaMessage } from "@/lib/prisma-errors";

import styles from "../portal.module.css";
import { AdminCreateForm } from "./AdminCreateForm";
import { TagCreateForm } from "./TagCreateForm";

function formatDate(value) {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminPage() {
  const adminUser = await requireAdmin();
  const now = new Date();
  let dashboardData;

  try {
    dashboardData = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.session.count({ where: { expiresAt: { gt: now } } }),
      prisma.tag.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          lastLoginAt: true,
        },
      }),
      prisma.tag.findMany({
        orderBy: { name: "asc" },
        take: 16,
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          _count: {
            select: {
              businessTags: true,
            },
          },
        },
      }),
    ]);
  } catch (error) {
    if (!isMissingPrismaTableError(error)) {
      throw error;
    }

    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>TX Local List // Admin Dashboard</p>
            <div className={styles.titleRow}>
              <div>
                <h1 className={styles.title}>Admin setup needs one more step.</h1>
                <p className={styles.copy}>
                  Signed in as {adminUser.email}. The admin route is protected,
                  but the current database has not fully caught up to the new schema.
                </p>
              </div>
              <div className={styles.actions}>
                <Link href="/dashboard" className={styles.secondaryLink}>
                  User dashboard
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
                <h2 className={styles.sectionTitle}>Database sync required</h2>
                <p className={styles.sectionCopy}>
                  {phase3SchemaMessage} Apply the Prisma schema update, then refresh this page.
                </p>
              </div>
            </div>
          </section>
        </section>
      </main>
    );
  }

  const [userCount, adminCount, activeSessionCount, tagCount, recentUsers, tags] =
    dashboardData;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>TX Local List // Admin Dashboard</p>
          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.title}>Control access from the server.</h1>
              <p className={styles.copy}>
                Signed in as {adminUser.email}. This route only renders for
                admins and pulls its metrics directly from Prisma.
              </p>
            </div>

            <div className={styles.actions}>
              <Link href="/dashboard" className={styles.secondaryLink}>
                User dashboard
              </Link>
              <Link href="/" className={styles.secondaryLink}>
                Back home
              </Link>
              <form action={logoutAction}>
                <button type="submit" className={styles.ghostButton}>
                  Log out
                </button>
              </form>
            </div>
          </div>
        </header>

        <section className={styles.cardGrid}>
          <article className={styles.card}>
            <p className={styles.cardLabel}>Users</p>
            <p className={styles.cardValue}>{userCount}</p>
            <p className={styles.cardNote}>
              Total registered accounts across every role.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.cardLabel}>Admins</p>
            <p className={styles.cardValue}>{adminCount}</p>
            <p className={styles.cardNote}>
              Admin users come from the seed flow or this dashboard.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.cardLabel}>Active sessions</p>
            <p className={styles.cardValue}>{activeSessionCount}</p>
            <p className={styles.cardNote}>
              Session records stay revocable because the browser only holds an
              opaque cookie token.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.cardLabel}>Directory tags</p>
            <p className={styles.cardValue}>{tagCount}</p>
            <p className={styles.cardNote}>
              Shared tags available for listings and future taxonomy controls.
            </p>
          </article>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Create admin account</h2>
              <p className={styles.sectionCopy}>
                This is the only in-app location that can create new admin
                credentials. Public signup stays limited to standard users.
              </p>
            </div>
          </div>

          <AdminCreateForm />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Create directory tag</h2>
              <p className={styles.sectionCopy}>
                Manage reusable tags that can be attached across the directory.
              </p>
            </div>
          </div>

          <TagCreateForm />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Directory tags</h2>
              <p className={styles.sectionCopy}>
                Existing tags and how many business records currently use each one.
              </p>
            </div>
          </div>

          {tags.length === 0 ? (
            <p className={styles.emptyState}>
              No tags exist yet. Create one above or run the tag seed script.
            </p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Businesses</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag) => (
                    <tr key={tag.id}>
                      <td>{tag.name}</td>
                      <td>{tag.slug}</td>
                      <td>{tag._count.businessTags}</td>
                      <td>{formatDate(tag.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Recent users</h2>
              <p className={styles.sectionCopy}>
                Latest accounts with role and last sign-in visibility.
              </p>
            </div>
          </div>

          {recentUsers.length === 0 ? (
            <p className={styles.emptyState}>
              No users exist yet. Run the admin seed, then create user accounts
              through `/signup`.
            </p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Last sign-in</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`${styles.rolePill} ${
                            user.role === "ADMIN" ? styles.adminRole : styles.userRole
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{formatDate(user.lastLoginAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
