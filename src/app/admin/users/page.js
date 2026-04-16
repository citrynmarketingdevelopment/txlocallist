import { AdminShell } from "../AdminShell";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { changeUserRoleAction } from "@/app/actions/admin";
import styles from "@/app/dashboard/dashboard.module.css";

function formatDate(val) {
  if (!val) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(val));
}

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, email: true, name: true, role: true,
      createdAt: true, lastLoginAt: true,
      _count: { select: { ownedBusinesses: true } },
    },
  });

  const roleCounts = { ALL: users.length, ADMIN: 0, OWNER: 0, USER: 0 };
  for (const u of users) roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;

  return (
    <AdminShell activeTab="users">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Users</h1>
          <p className={styles.pageSubtitle}>
            {roleCounts.ALL} total &mdash; {roleCounts.ADMIN} admins, {roleCounts.OWNER} owners, {roleCounts.USER} consumers
          </p>
        </div>
      </div>

      <div className={styles.businessesTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCol} style={{ flex: 2 }}>Email</div>
          <div className={styles.tableCol} style={{ flex: 1 }}>Role</div>
          <div className={styles.tableCol} style={{ flex: 1 }}>Listings</div>
          <div className={styles.tableCol} style={{ flex: 1 }}>Joined</div>
          <div className={styles.tableCol} style={{ flex: 1 }}>Last Login</div>
          <div className={styles.tableCol} style={{ flex: 1.5 }}>Change Role</div>
        </div>
        <div className={styles.tableBody}>
          {users.map((u) => (
            <div key={u.id} className={styles.tableRow}>
              <div className={styles.tableCol} style={{ flex: 2 }}>
                <p className={styles.businessName}>{u.email}</p>
                {u.name && <p className={styles.businessMeta}>{u.name}</p>}
              </div>
              <div className={styles.tableCol} style={{ flex: 1 }}>
                <span className={
                  u.role === "ADMIN" ? styles.statusACTIVE :
                  u.role === "OWNER" ? styles.statusDRAFT : styles.statusPAUSED
                }>{u.role}</span>
              </div>
              <div className={styles.tableCol} style={{ flex: 1 }}>{u._count.ownedBusinesses}</div>
              <div className={styles.tableCol} style={{ flex: 1 }}>{formatDate(u.createdAt)}</div>
              <div className={styles.tableCol} style={{ flex: 1 }}>{formatDate(u.lastLoginAt)}</div>
              <div className={styles.tableCol} style={{ flex: 1.5 }}>
                <form action={changeUserRoleAction} style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  <input type="hidden" name="id" value={u.id} />
                  <select name="role" defaultValue={u.role} className={styles.filterTab}
                    style={{ padding: "0.3rem 0.5rem", fontSize: "0.8rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(45,36,30,0.2)" }}>
                    <option value="USER">USER</option>
                    <option value="OWNER">OWNER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button type="submit" className={styles.actionButton} style={{ fontSize: "0.8rem" }}>Save</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
