import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { isMissingPrismaTableError } from "@/lib/prisma-errors";
import { Navbar, Footer } from "@/components";

import styles from "./page.module.css";

// helpers

function normalizeCity(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeFilter(value) {
  const v = typeof value === "string" ? value.trim().toLowerCase() : "";
  return ["weekend", "month"].includes(v) ? v : "all";
}

function formatDateLabel(date) {
  if (!date) return "UPCOMING";
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return "TODAY";
  if (d.toDateString() === tomorrow.toDateString()) return "TOMORROW";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d).toUpperCase();
}

function formatTime(date) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function getWeekendRange() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSat = day === 6 ? 7 : (6 - day + 7) % 7 || 7;
  const sat = new Date(now);
  sat.setDate(now.getDate() + daysUntilSat);
  sat.setHours(0, 0, 0, 0);
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  sun.setHours(23, 59, 59, 999);
  return { start: sat, end: sun };
}

function getMonthEnd() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
}

function groupEventsByDate(events) {
  const groups = new Map();
  for (const event of events) {
    const label = formatDateLabel(event.startDate);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(event);
  }
  return groups;
}

function buildUrl(city, filter) {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (filter && filter !== "all") params.set("filter", filter);
  const q = params.toString();
  return "/events" + (q ? "?" + q : "");
}

// metadata

export const metadata = {
  title: "Local Events | TX Localist",
  description:
    "Discover what's happening across Texas — local pop-ups, live music, community gatherings, and more.",
};

// page

export default async function EventsPage({ searchParams }) {
  const p = await searchParams;
  const selectedCity = normalizeCity(p?.city);
  const activeFilter = normalizeFilter(p?.filter);

  let events = [];
  let cities = [];
  let schemaReady = true;

  try {
    const now = new Date();

    let dateWhere;
    if (activeFilter === "weekend") {
      const { start, end } = getWeekendRange();
      dateWhere = { startDate: { gte: start, lte: end } };
    } else if (activeFilter === "month") {
      dateWhere = { startDate: { gte: now, lte: getMonthEnd() } };
    } else {
      dateWhere = { OR: [{ startDate: null }, { startDate: { gte: now } }] };
    }

    const cityWhere = selectedCity
      ? { city: { equals: selectedCity, mode: "insensitive" } }
      : {};

    const where = { status: "PUBLISHED", ...cityWhere, ...dateWhere };

    [events, cities] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { startDate: "asc" },
        include: {
          tags: { orderBy: { name: "asc" } },
          business: { select: { name: true, slug: true } },
        },
      }),
      prisma.event.findMany({
        where: { status: "PUBLISHED" },
        distinct: ["city"],
        orderBy: { city: "asc" },
        select: { city: true },
      }),
    ]);
  } catch (error) {
    if (isMissingPrismaTableError(error)) {
      schemaReady = false;
    } else {
      throw error;
    }
  }

  const displayCity = selectedCity
    ? cities.find((c) => c.city.toLowerCase() === selectedCity)?.city ||
      selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)
    : null;

  const groupedEvents = groupEventsByDate(events);

  return (
    <>
      <Navbar />

      <div className={styles.pageWrapper}>

        <section className={styles.heroSection}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>TX Localist // Events</p>
            <h1 className={styles.heroTitle}>
              {displayCity ? (
                <>
                  {"What's Happening in "}
                  <span className={styles.cityHighlight}>{displayCity}</span>
                </>
              ) : (
                "What's Happening in Texas"
              )}
            </h1>
            <p className={styles.heroCopy}>
              Local pop-ups, community gatherings, live music, and more —
              straight from the businesses on the list.
            </p>
          </div>
          <div className={styles.heroStar} aria-hidden="true">★</div>
        </section>

        {cities.length > 0 && (
          <section className={styles.cityPicker}>
            <div className={styles.cityScroll}>
              <Link
                href={buildUrl("", activeFilter)}
                className={styles.cityPill + (!selectedCity ? " " + styles.cityPillActive : "")}
              >
                All Texas
              </Link>
              {cities.map(({ city }) => {
                const slug = city.toLowerCase();
                const isActive = selectedCity === slug;
                return (
                  <Link
                    key={city}
                    href={buildUrl(slug, activeFilter)}
                    className={styles.cityPill + (isActive ? " " + styles.cityPillActive : "")}
                  >
                    {city}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className={styles.filterRow}>
          {[
            { key: "all",     label: "All Upcoming" },
            { key: "weekend", label: "This Weekend"  },
            { key: "month",   label: "This Month"    },
          ].map(({ key, label }) => {
            const isActive = activeFilter === key;
            return (
              <Link
                key={key}
                href={buildUrl(selectedCity, key)}
                className={styles.filterChip + (isActive ? " " + styles.filterChipActive : "")}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {!schemaReady ? (
          <div className={styles.emptyState}>
            <p>
              Events table not yet migrated. Run <code>npm run db:push</code>{" "}
              and reload.
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🎉</span>
            <h2 className={styles.emptyTitle}>Nothing scheduled yet</h2>
            <p className={styles.emptyDesc}>
              {displayCity
                ? "No upcoming events in " + displayCity + " for this period. Try a different filter or browse all of Texas."
                : "No upcoming events right now. Check back soon!"}
            </p>
            {(selectedCity || activeFilter !== "all") && (
              <Link href="/events" className={styles.emptyLink}>
                Browse all Texas →
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.eventFeed}>
            {Array.from(groupedEvents.entries()).map(function(entry) {
              const dateLabel = entry[0];
              const dateEvents = entry[1];
              return (
                <div key={dateLabel} className={styles.dateGroup}>
                  <div className={styles.dateGroupHeader}>
                    <span className={styles.dateLine} aria-hidden="true" />
                    <span className={styles.dateGroupLabel}>{dateLabel}</span>
                    <span className={styles.dateLine} aria-hidden="true" />
                  </div>

                  <div className={styles.eventGrid}>
                    {dateEvents.map(function(event) {
                      return (
                        <article key={event.id} className={styles.eventCard}>

                          {event.imageUrl && (
                            <div className={styles.cardImgWrap}>
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className={styles.cardImg}
                              />
                              {event.startDate && (
                                <div className={styles.dateBadge}>
                                  <span className={styles.dateBadgeDay}>
                                    {new Date(event.startDate).getDate()}
                                  </span>
                                  <span className={styles.dateBadgeMon}>
                                    {new Intl.DateTimeFormat("en-US", { month: "short" })
                                      .format(new Date(event.startDate))
                                      .toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className={styles.cardBody}>
                            {event.startDate && (
                              <p className={styles.cardTime}>
                                <span className="material-icons" style={{ fontSize: "0.9rem" }}>schedule</span>
                                {formatTime(event.startDate)}
                                {event.endDate && " — " + formatTime(event.endDate)}
                              </p>
                            )}

                            <h2 className={styles.cardTitle}>{event.title}</h2>

                            <p className={styles.cardVenue}>
                              <span className="material-icons" style={{ fontSize: "0.9rem" }}>location_on</span>
                              {event.addressName ? event.addressName + " · " : ""}
                              {event.city}, TX
                            </p>

                            {event.description && (
                              <p className={styles.cardDesc}>{event.description}</p>
                            )}

                            {event.business && (
                              <Link
                                href={"/business/" + event.business.slug}
                                className={styles.businessLink}
                              >
                                <span className="material-icons" style={{ fontSize: "0.85rem" }}>storefront</span>
                                {event.business.name}
                              </Link>
                            )}

                            {event.tags.length > 0 && (
                              <div className={styles.tagRow}>
                                {event.tags.map(function(tag) {
                                  return (
                                    <span key={tag.id} className={styles.tagPill}>
                                      #{tag.name}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}
