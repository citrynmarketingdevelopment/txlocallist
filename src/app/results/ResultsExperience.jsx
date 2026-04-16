"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import logoImage from "@/app/assets/Tx-Localist-01.png";
import SearchBar from "@/components/SearchBar";
import CategoryPills from "@/components/CategoryPills/CategoryPills";

import {
  ArrowRightIcon,
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  PlusCircleIcon,
  ShareIcon,
} from "./icons";

/* ─── Card views ──────────────────────────────────────────── */
function BusinessCard({ biz }) {
  return (
    <article className="gem-card card-stack-effect">
      {biz.imageUrl && biz.imageUrl !== "/placeholder.jpg" && (
        <div className="gem-image-wrapper">
          <img src={biz.imageUrl} alt={biz.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div className="category-tag">{biz.city?.name ?? biz.city}</div>
      <h4 className="gem-name">{biz.name}</h4>
      <p className="gem-desc">
        {biz.description?.slice(0, 120)}{biz.description?.length > 120 ? "..." : ""}
      </p>
      <div className="gem-footer">
        <span className="font-accent gem-meta">
          {biz.categories?.[0]?.name?.toUpperCase() ?? "LOCAL BUSINESS"}
        </span>
        <Link href={"/business/" + biz.slug} className="gem-action-btn">
          <ArrowRightIcon size={16} />
        </Link>
      </div>
    </article>
  );
}

function EventCard({ event }) {
  const fmt = (val) => val
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(val))
    : null;
  return (
    <article className="gem-card card-stack-effect">
      {event.imageUrl && (
        <div className="gem-image-wrapper">
          <img src={event.imageUrl} alt={event.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div className="category-tag bg-retro-red text-white">
        {event.startDate ? fmt(event.startDate) : "EVENT"}
      </div>
      <h4 className="gem-name">{event.title}</h4>
      <p className="gem-desc">
        {event.description?.slice(0, 100)}{event.description?.length > 100 ? "..." : ""}
      </p>
      <p className="gem-address" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
        {event.addressName || event.address} &middot; {event.city}
      </p>
      <div className="gem-footer">
        <span className="font-accent gem-meta">{event.city}, {event.state}</span>
        <Link href="/events" className="gem-action-btn"><ArrowRightIcon size={16} /></Link>
      </div>
    </article>
  );
}

/* ─── List-row views ──────────────────────────────────────── */
function BusinessRow({ biz }) {
  return (
    <article className="list-item">
      <div className="list-item-thumb">
        {biz.imageUrl && biz.imageUrl !== "/placeholder.jpg"
          ? <img src={biz.imageUrl} alt={biz.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span className="material-icons list-item-thumb-icon">storefront</span>
        }
      </div>
      <div className="list-item-body">
        <div className="list-item-meta">
          <span className="font-accent list-item-city">{biz.city?.name ?? biz.city}</span>
          {biz.categories?.[0]?.name && (
            <span className="font-accent list-item-cat">{biz.categories[0].name.toUpperCase()}</span>
          )}
        </div>
        <h4 className="list-item-name">{biz.name}</h4>
        <p className="list-item-desc">
          {biz.description?.slice(0, 160)}{biz.description?.length > 160 ? "..." : ""}
        </p>
      </div>
      <Link href={"/business/" + biz.slug} className="gem-action-btn list-item-arrow">
        <ArrowRightIcon size={16} />
      </Link>
    </article>
  );
}

function EventRow({ event }) {
  const fmt = (val) => val
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(val))
    : null;
  return (
    <article className="list-item">
      <div className="list-item-thumb list-item-thumb-event">
        {event.imageUrl
          ? <img src={event.imageUrl} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span className="material-icons list-item-thumb-icon">event</span>
        }
      </div>
      <div className="list-item-body">
        <div className="list-item-meta">
          <span className="font-accent list-item-city list-item-city-event">
            {event.startDate ? fmt(event.startDate) : "EVENT"}
          </span>
          <span className="font-accent list-item-cat">{event.city}</span>
        </div>
        <h4 className="list-item-name">{event.title}</h4>
        <p className="list-item-desc">
          {event.description?.slice(0, 160)}{event.description?.length > 160 ? "..." : ""}
        </p>
      </div>
      <Link href="/events" className="gem-action-btn list-item-arrow">
        <ArrowRightIcon size={16} />
      </Link>
    </article>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function ResultsExperience({ initialQuery = "", initialLocation = "", user = null, dashboardPath = null }) {
  const router    = useRouter();
  const urlParams = useSearchParams();

  const [activeTab,   setActiveTab]   = useState(urlParams.get("tab") === "events" ? "events" : "businesses");
  const [isSearching, setIsSearching] = useState(false);
  const [businesses,  setBusinesses]  = useState([]);
  const [events,      setEvents]      = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearch,  setLastSearch]  = useState({ q: initialQuery, loc: initialLocation });
  const [viewMode,         setViewMode]         = useState("card"); // "card" | "list" | "map"
  const [showCities,       setShowCities]       = useState(false);
  const [showCategories,   setShowCategories]   = useState(false);
  const [showMobileCities, setShowMobileCities] = useState(false);
  const [activeSort,       setActiveSort]       = useState(""); // "" | "popular"

  const currentYear = new Date().getFullYear();
  const mapsApiKey  = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (initialQuery || initialLocation) runSearch(initialQuery, initialLocation);
  }, []);

  async function runSearch(q, loc, sort = "") {
    setIsSearching(true);
    setHasSearched(true);
    setLastSearch({ q, loc });
    setActiveSort(sort);

    const bizP = new URLSearchParams();
    if (q)    bizP.set("q",    q);
    if (loc)  bizP.set("loc",  loc);
    if (sort) bizP.set("sort", sort);

    const evtP = new URLSearchParams();
    if (loc) evtP.set("city", loc);
    else if (q) evtP.set("city", q);
    evtP.set("limit", "12");

    try {
      const [bizRes, evtRes] = await Promise.all([
        fetch("/api/search?" + bizP).then((r) => r.json()),
        fetch("/api/events?" + evtP).then((r) => r.ok ? r.json() : { events: [] }).catch(() => ({ events: [] })),
      ]);
      const bizList = bizRes?.data?.results ?? [];
      const evtList = evtRes?.events ?? [];
      setBusinesses(bizList);
      setEvents(evtList);

      // Auto-switch if the active tab has no results
      if (activeTab === "businesses" && bizList.length === 0 && evtList.length > 0) setActiveTab("events");
      else if (activeTab === "events" && evtList.length === 0 && bizList.length > 0) setActiveTab("businesses");
    } catch (_) {
      setBusinesses([]);
      setEvents([]);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSearchBarSubmit({ query, location, type }) {
    setActiveTab(type);
    const qs = new URLSearchParams();
    if (query)    qs.set("q",   query);
    if (location) qs.set("loc", location);
    qs.set("tab", type);
    router.replace("/results?" + qs.toString(), { scroll: false });
    runSearch(query, location);
  }

  function clearSearch() {
    setBusinesses([]);
    setEvents([]);
    setHasSearched(false);
    router.replace("/results", { scroll: false });
  }

  /* Results panel (tab + view-mode aware) */
  function ResultsPanel() {
    if (isSearching) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "2rem 0", color: "var(--muted)" }}>
          <LoaderIcon size={24} className="animate-spin" />
          <span className="font-accent">SEARCHING...</span>
        </div>
      );
    }

    /* ── Map view placeholder ── */
    if (viewMode === "map") {
      return (
        <div className="results-map-placeholder">
          <MapPinIcon size={52} style={{ color: "var(--retro-red)", marginBottom: "1rem" }} />
          <h4 className="font-display results-map-title">Map View</h4>
          <p className="results-map-desc">
            Interactive map results are coming soon.<br />
            Drop a pin on your city and explore what&apos;s nearby.
          </p>
          <div className="font-accent results-map-badge">COMING SOON</div>
        </div>
      );
    }

    /* ── Business results ── */
    if (activeTab === "businesses") {
      if (businesses.length === 0)
        return <p className="error-banner">No businesses found. Try a different keyword or city.</p>;
      return viewMode === "list"
        ? <div className="list-container">{businesses.map((b) => <BusinessRow key={b.id} biz={b} />)}</div>
        : <div className="grid-container">{businesses.map((b) => <BusinessCard key={b.id} biz={b} />)}</div>;
    }

    /* ── Event results ── */
    if (events.length === 0) {
      return (
        <p className="error-banner">
          No events found near {lastSearch.loc || lastSearch.q || "this area"}.{" "}
          <Link href="/dashboard/events/new" style={{ color: "var(--retro-teal)", fontWeight: 700 }}>
            Post one →
          </Link>
        </p>
      );
    }
    return viewMode === "list"
      ? <div className="list-container">{events.map((e) => <EventRow key={e.id} event={e} />)}</div>
      : <div className="grid-container">{events.map((e) => <EventCard key={e.id} event={e} />)}</div>;
  }

  return (
    <div className="app-container">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-content">
          <Image src={logoImage} alt="Texas Localist" width={220} height={140}
            sizes="220px" className="logo-image" priority />
          <nav className="sidebar-nav">
            {/* Events */}
            <Link href="/events" className="font-accent nav-link">
              <div className="nav-icon-wrapper">
                <span className="material-icons" style={{ fontSize: "1.2rem", color: "white" }}>event</span>
              </div>
              EVENTS
            </Link>

            {/* Cities dropdown */}
            <div className="nav-cities-wrap">
              <button
                type="button"
                onClick={() => setShowCities((v) => !v)}
                className={"font-accent nav-link nav-link-btn" + (showCities ? " nav-link-open" : "")}
              >
                <div className="nav-icon-wrapper">
                  <span className="material-icons" style={{ fontSize: "1.2rem", color: "white" }}>location_city</span>
                </div>
                CITIES
                <span className={"material-icons nav-chevron" + (showCities ? " nav-chevron-open" : "")}>
                  expand_more
                </span>
              </button>
              {showCities && (
                <div className="cities-dropdown">
                  {[
                    "Austin", "Houston", "Dallas", "San Antonio", "Fort Worth",
                    "El Paso", "Corpus Christi", "Lubbock", "Amarillo", "Waco",
                    "San Marcos", "Marfa", "Laredo", "Plano", "Arlington",
                  ].map((city) => (
                    <button
                      key={city}
                      type="button"
                      className="font-accent city-option"
                      onClick={() => {
                        setShowCities(false);
                        setActiveTab("businesses");
                        runSearch("", city);
                      }}
                    >
                      <span className="material-icons city-option-pin">place</span>
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Categories dropdown */}
            <div className="nav-cities-wrap">
              <button
                type="button"
                onClick={() => setShowCategories((v) => !v)}
                className={"font-accent nav-link nav-link-btn" + (showCategories ? " nav-link-open" : "")}
              >
                <div className="nav-icon-wrapper">
                  <span className="material-icons" style={{ fontSize: "1.2rem", color: "white" }}>category</span>
                </div>
                CATEGORIES
                <span className={"material-icons nav-chevron" + (showCategories ? " nav-chevron-open" : "")}>
                  expand_more
                </span>
              </button>
              {showCategories && (
                <div className="cities-dropdown">
                  {[
                    { label: "Food & Drink", icon: "restaurant",     q: "food"    },
                    { label: "Retail",       icon: "shopping_bag",   q: "retail"  },
                    { label: "Coffee",       icon: "coffee",         q: "coffee"  },
                    { label: "Beauty",       icon: "spa",            q: "beauty"  },
                    { label: "Fitness",      icon: "fitness_center", q: "fitness" },
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      className="font-accent city-option"
                      onClick={() => {
                        setShowCategories(false);
                        setActiveTab("businesses");
                        runSearch(cat.q, lastSearch.loc);
                      }}
                    >
                      <span className="material-icons city-option-pin">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New listings */}
            <button
              type="button"
              className="font-accent nav-link nav-link-btn"
              onClick={() => { setActiveTab("businesses"); runSearch("", ""); }}
            >
              <div className="nav-icon-wrapper nav-icon-new">
                <span className="material-icons" style={{ fontSize: "1.2rem", color: "white" }}>fiber_new</span>
              </div>
              NEW
            </button>

            {/* Most Popular */}
            <button
              type="button"
              className={"font-accent nav-link nav-link-btn" + (activeSort === "popular" ? " nav-link-popular-active" : "")}
              onClick={() => { setActiveTab("businesses"); runSearch("", lastSearch.loc, "popular"); }}
            >
              <div className="nav-icon-wrapper nav-icon-hot">
                <span className="fire-emoji">🔥</span>
              </div>
              MOST POPULAR
              {activeSort === "popular" && (
                <span className="hot-badge hot-badge-live font-accent">LIVE</span>
              )}
            </button>

            {/* Add listing */}
            <Link href="/post-your-business" className="font-accent nav-link">
              <div className="nav-icon-wrapper"><PlusCircleIcon size={20} style={{ color: "white" }} /></div>
              ADD LISTING
            </Link>

            <Link
              href={user ? dashboardPath : "/login"}
              className={"card-stack-effect font-accent nav-link login-btn" + (user ? " login-btn-dashboard" : "")}
            >
              {user ? "DASHBOARD" : "LOGIN"}
            </Link>
          </nav>
        </div>
        <div className="sidebar-footer">
          &copy; {currentYear} TEXAS LOCALIST.<br />HANDCRAFTED IN THE LONE STAR STATE.
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main-content grainy-overlay">
        {/* Search header — full-width search bar */}
        <header className="search-header">
          <div className="search-bar-container">
            <div className="mobile-logo-wrap">
              <Image src={logoImage} alt="Texas Localist" width={260} height={160}
                sizes="(max-width: 768px) 220px, 260px" className="mobile-logo-image" priority />
            </div>
            <SearchBar
              action="/results"
              initialQuery={lastSearch.q}
              initialLocation={lastSearch.loc}
              initialType={activeTab}
              variant="inline"
              onSubmit={handleSearchBarSubmit}
            />
          </div>
        </header>

        <div className="content-wrapper">
          {/* ── Post-search results ── */}
          {hasSearched && (
            <section className="results-section">
              <div className="results-header">
                {/* Left: result count */}
                <span className="font-accent results-count">
                  {isSearching ? "SEARCHING..." : (
                    activeTab === "businesses"
                      ? `${businesses.length} BUSINESS${businesses.length !== 1 ? "ES" : ""}${activeSort === "popular" ? " · 🔥 MOST POPULAR" : ""}`
                      : `${events.length} EVENT${events.length !== 1 ? "S" : ""}`
                  )}
                </span>

                {/* Right: view toggle + clear */}
                <div className="results-header-right">
                  <div className="view-toggle" role="group" aria-label="View mode">
                    {[
                      { mode: "card", icon: "grid_view",  label: "Card view" },
                      { mode: "list", icon: "view_list",  label: "List view" },
                      { mode: "map",  icon: "map",        label: "Map view"  },
                    ].map(({ mode, icon, label }) => (
                      <button
                        key={mode}
                        type="button"
                        aria-pressed={viewMode === mode}
                        aria-label={label}
                        onClick={() => setViewMode(mode)}
                        className={"view-toggle-btn font-accent" + (viewMode === mode ? " view-toggle-active" : "")}
                      >
                        <span className="material-icons" style={{ fontSize: "1.1rem" }}>{icon}</span>
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={clearSearch} className="font-accent clear-btn">
                    CLEAR
                  </button>
                </div>
              </div>
              <ResultsPanel />
            </section>
          )}

          {/* ── Default browse state — full-width map ── */}
          {!hasSearched && (
            <section className="map-section-full" aria-label="Explore Texas">
              <div className="map-header">
                <h3 className="map-title">Explore the <span className="text-retro-orange">Map</span></h3>
                <span className="font-accent map-subtitle">INTERACTIVE VIEW</span>
              </div>
              <div className="map-container-full card-stack-effect">
                {mapsApiKey && (
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, display: "block" }}
                    src={"https://www.google.com/maps/embed/v1/search?key=" + mapsApiKey + "&q=local+gems+Texas&center=31.9686,-99.9018&zoom=6"}
                    allowFullScreen
                    title="Texas Localist Map"
                  />
                )}
                {!mapsApiKey && (
                  <div className="map-overlay">
                    <div className="map-overlay-content">
                      <MapPinIcon size={48} className="map-pin-icon" style={{ color: "var(--retro-red)" }} />
                      <h4 className="map-overlay-title">Map Preview</h4>
                      <p className="map-overlay-desc">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the live map.</p>
                      <div className="font-accent demo-badge">DEMO MODE</div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="promo-banner">
            <div className="banner-bg"><div className="banner-gradient"></div></div>
            <div className="banner-content">
              <h3 className="text-shadow-retro banner-title">Skip the <span className="text-retro-yellow">Noise.</span></h3>
              <p className="font-accent banner-subtitle">No ads. No nonsense. Just local.</p>
              <Link href="/post-your-business" className="card-stack-effect font-accent banner-btn">ADD YOUR BUSINESS</Link>
            </div>
          </section>
        </div>

        <footer className="app-footer">
          <div className="font-accent footer-links">
            <Link href="/">HOME</Link>
            <Link href="/events">EVENTS</Link>
            <Link href="/login">LOGIN</Link>
          </div>
          <div className="footer-social">
            <a href="https://www.google.com/maps/search/?api=1&query=Texas+local+gems"
              target="_blank" rel="noopener noreferrer" className="social-link">
              <ShareIcon size={16} />
            </a>
            <Link href="/results" className="social-link"><CameraIcon size={16} /></Link>
          </div>
        </footer>
      </main>

      {/* ── Mobile bottom nav (hidden on desktop) ── */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <Link href="/events" className="font-accent mobile-nav-item">
          <span className="material-icons">event</span>
          <span>EVENTS</span>
        </Link>
        <button
          type="button"
          className="font-accent mobile-nav-item"
          onClick={() => setShowMobileCities(true)}
        >
          <span className="material-icons">location_city</span>
          <span>CITIES</span>
        </button>
        <button
          type="button"
          className="font-accent mobile-nav-item"
          onClick={() => { setActiveTab("businesses"); runSearch("", ""); }}
        >
          <span className="material-icons">fiber_new</span>
          <span>NEW</span>
        </button>
        <Link
          href={user ? dashboardPath : "/login"}
          className={"font-accent mobile-nav-item" + (user ? " mobile-nav-dashboard" : "")}
        >
          <span className="material-icons">{user ? "dashboard" : "login"}</span>
          <span>{user ? "DASHBOARD" : "LOGIN"}</span>
        </Link>
      </nav>

      {/* ── Mobile city picker sheet ── */}
      {showMobileCities && (
        <div className="mobile-city-overlay" onClick={() => setShowMobileCities(false)}>
          <div className="mobile-city-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-city-header">
              <span className="font-accent">PICK A CITY</span>
              <button
                type="button"
                className="mobile-city-close"
                onClick={() => setShowMobileCities(false)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="mobile-city-grid">
              {[
                "Austin", "Houston", "Dallas", "San Antonio", "Fort Worth",
                "El Paso", "Corpus Christi", "Lubbock", "Amarillo", "Waco",
                "San Marcos", "Marfa", "Laredo", "Plano", "Arlington",
              ].map((city) => (
                <button
                  key={city}
                  type="button"
                  className="font-accent mobile-city-btn"
                  onClick={() => {
                    setShowMobileCities(false);
                    setActiveTab("businesses");
                    runSearch("", city);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
