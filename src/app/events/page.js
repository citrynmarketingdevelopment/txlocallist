import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { isMissingPrismaTableError } from "@/lib/prisma-errors";

import styles from "./page.module.css";

function normalizeFilter(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

export const metadata = {
  title: "Local Events | Texas Localist",
  description: "Browse local events happening across Texas.",
};

export default async function EventsPage({ searchParams }) {
  const user = await getCurrentUser();
  const p = await searchParams;
  const selectedCity  = normalizeFilter(p?.city);
  const selectedState = normalizeFilter(p?.state);
  const selectedTag   = normalizeFilter(p?.tag);
  const created       = normalizeFilter(p?.created) === "1";

  let events = [];
  let tags   = [];
  let cities = [];
  let schemaReady = true;

  try {
    const where = { status: "PUBLISHED" };
    if (selectedCity)  where.city  = { equals: selectedCity,  mode: "insensitive" };
    if (selectedState) where.state = { equals: selectedState, mode: "insensitive" };
    if (selectedTag)   where.tags  = { some: { slug: selectedTag } };

    [events, tags, cities] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          tags:    { orderBy: { name: "asc" } },
          creator: { select: { email: true } },
          business: { select: { name: true, slug: true } },
        },
      }),
      prisma.tag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true } }),
      prisma.event.findMany({ distinct: ["city"], orderBy: { city: "asc" }, select: { city: true } }),
    ]);
  } catch (error) {
    if (isMissingPrismaTableError(error)) {
      schemaReady = false;
    } else {
      throw error;
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>TX Localist // Events</p>
            <h1 className={styles.title}>Find what is happening nearby.</h1>
            <p className={styles.copy}>
              Browse local events, filter by city or tag, and surface the
              gatherings that matter to your community.
            </p>
          </div>

          <div className={styles.actions}>
            {user ? (
              <Link href="/dashboard/events/new" className={styles.primaryLink}>
                Create event
              </Link>
            ) : (
              <Link href="/login" className={styles.primaryLink}>
                Log in to post
              </Link>
            )}
            <Link href="/" className={styles.secondaryLink}>
              Back home
            </Link>
          </div>
        </header>

        {created && (
          <section className={styles.notice}>
            Your event was published and is now showing in the directory.
          </section>
        )}

        {!schemaReady && (
          <section className={styles.emptyState}>
            The events table is not yet in the database. Run{" "}
            <code>npm run db:push</code> to apply the latest schema, then
            reload this page.
          </section>
        )}

        {schemaReady && (
          <>
            <section className={styles.filterPanel}>
              <form className={styles.filterForm}>
                <div className={styles.filterField}>
                  <label htmlFor="city" className={styles.label}>City</label>
                  <select id="city" name="city" defaultValue={selectedCity} className={styles.select}>
                    <option value="">All cities</option>
                    {cities.map(({ city }) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterField}>
                  <label htmlFor="tag" className={styles.label}>Tag</label>
                  <select id="tag" name="tag" defaultValue={selectedTag} className={styles.select}>
                    <option value="">All tags</option>
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.slug}>{tag.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterActions}>
                  <button type="submit" className={styles.primaryButton}>Apply filters</button>
                  <Link href="/events" className={styles.secondaryLink}>Clear</Link>
                </div>
              </form>
            </section>

            <section className={styles.resultsHeader}>
              <p className={styles.resultCount}>{events.length} event{events.length !== 1 ? "s" : ""}</p>
            </section>

            {events.length === 0 ? (
              <section className={styles.emptyState}>
                No events yet.{" "}
                {user ? (
                  <Link href="/dashboard/events/new">Create the first one →</Link>
                ) : (
                  <Link href="/login">Log in to post an event →</Link>
                )}
              </section>
            ) : (
              <section className={styles.grid}>
                {events.map((event) => (
                  <article key={event.id} className={styles.card}>
                    {event.imageUrl && (
                      <div
                        className={styles.cardImage}
                        style={{ backgroundImage: `url("${event.imageUrl}")` }}
                      />
                    )}
                    <div className={styles.cardBody}>
                      <p className={styles.cardMeta}>
                        {event.addressName}
                        {event.startDate && ` | ${formatDate(event.startDate)}`}
                        {event.business && (
                          <span> · <Link href={`/business/${event.business.slug}`}>{event.business.name}</Link></span>
                        )}
                      </p>
                      <h2 className={styles.cardTitle}>{event.title}</h2>
                      <p className={styles.cardLocation}>
                        {event.address}, {event.city}, {event.state} {event.zipCode}
                      </p>
                      <p className={styles.cardDescription}>{event.description}</p>
                      <div className={styles.tagRow}>
                        {event.tags.map((tag) => (
                          <span key={tag.id} className={styles.tagPill}>{tag.name}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
