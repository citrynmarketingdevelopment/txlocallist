import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

import styles from "./page.module.css";

function normalizeFilter(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default async function EventsPage({ searchParams }) {
  const user = await getCurrentUser();
  const selectedCity = normalizeFilter(searchParams?.city);
  const selectedState = normalizeFilter(searchParams?.state);
  const selectedTag = normalizeFilter(searchParams?.tag);
  const created = normalizeFilter(searchParams?.created) === "1";
  const where = {};

  if (selectedCity) {
    where.city = {
      equals: selectedCity,
      mode: "insensitive",
    };
  }

  if (selectedState) {
    where.state = {
      equals: selectedState,
      mode: "insensitive",
    };
  }

  if (selectedTag) {
    where.tags = {
      some: {
        slug: selectedTag,
      },
    };
  }

  const [events, tags, cities, states] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tags: {
          orderBy: {
            name: "asc",
          },
        },
      },
    }),
    prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.event.findMany({
      distinct: ["city"],
      orderBy: {
        city: "asc",
      },
      select: {
        city: true,
      },
    }),
    prisma.event.findMany({
      distinct: ["state"],
      orderBy: {
        state: "asc",
      },
      select: {
        state: true,
      },
    }),
  ]);

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>TX Local List // Events</p>
            <h1 className={styles.title}>Find what is happening nearby.</h1>
            <p className={styles.copy}>
              Browse local events, filter by city, state, or tag, and surface
              the gatherings that matter to your community.
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

        {created ? (
          <section className={styles.notice}>
            Your event was published and is now showing in the directory.
          </section>
        ) : null}

        <section className={styles.filterPanel}>
          <form className={styles.filterForm}>
            <div className={styles.filterField}>
              <label htmlFor="city" className={styles.label}>
                City
              </label>
              <select
                id="city"
                name="city"
                defaultValue={selectedCity}
                className={styles.select}
              >
                <option value="">All cities</option>
                {cities.map(({ city }) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterField}>
              <label htmlFor="state" className={styles.label}>
                State
              </label>
              <select
                id="state"
                name="state"
                defaultValue={selectedState}
                className={styles.select}
              >
                <option value="">All states</option>
                {states.map(({ state }) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterField}>
              <label htmlFor="tag" className={styles.label}>
                Tag
              </label>
              <select
                id="tag"
                name="tag"
                defaultValue={selectedTag}
                className={styles.select}
              >
                <option value="">All tags</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.slug}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterActions}>
              <button type="submit" className={styles.primaryButton}>
                Apply filters
              </button>
              <Link href="/events" className={styles.secondaryLink}>
                Clear
              </Link>
            </div>
          </form>
        </section>

        <section className={styles.resultsHeader}>
          <div>
            <p className={styles.resultCount}>{events.length} events</p>
            <p className={styles.resultCopy}>
              Filter by place or tag to narrow the event feed.
            </p>
          </div>
        </section>

        {events.length === 0 ? (
          <section className={styles.emptyState}>
            No events matched those filters yet. Adjust the filters or publish a
            new event.
          </section>
        ) : (
          <section className={styles.grid}>
            {events.map((event) => (
              <article key={event.id} className={styles.card}>
                <div
                  className={styles.cardImage}
                  style={{ backgroundImage: `url("${event.imageUrl}")` }}
                />

                <div className={styles.cardBody}>
                  <p className={styles.cardMeta}>
                    {event.addressName} | {formatDate(event.createdAt)}
                  </p>
                  <h2 className={styles.cardTitle}>{event.title}</h2>
                  <p className={styles.cardLocation}>
                    {event.address}, {event.city}, {event.state} {event.zipCode},{" "}
                    {event.country}
                  </p>
                  <p className={styles.cardDescription}>{event.description}</p>

                  <div className={styles.tagRow}>
                    {event.tags.map((tag) => (
                      <span key={tag.id} className={styles.tagPill}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
