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
  CompassIcon,
  LoaderIcon,
  MapPinIcon,
  PlusCircleIcon,
  ShareIcon,
} from "./icons";

/* ─── Cards ─────────────────────────────────────────────── */
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

/* ─── Main component ─────────────────────────────────────── */
export default function ResultsExperience({ initialQuery = "", initialLocation = "" }) {
  const router    = useRouter();
  const urlParams = useSearchParams();

  const [activeTab,   setActiveTab]   = useState(urlParams.get("tab") === "events" ? "events" : "businesses");
  const [isSearching, setIsSearching] = useState(false);
  const [businesses,  setBusinesses]  = useState([]);
  const [events,      setEvents]      = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearch,  setLastSearch]  = useState({ q: initialQuery, loc: initialLocation });

  const currentYear = new Date().getFullYear();
  const mapsApiKey  = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (initialQuery || initialLocation) runSearch(initialQuery, initialLocation);
  }, []);

  async function runSearch(q, loc) {
    setIsSearching(true);
    setHasSearched(true);
    setLastSearch({ q, loc });

    const bizP = new URLSearchParams();
    if (q)   bizP.set("q",   q);
    if (loc) bizP.set("loc", loc);

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

  /* Results panel (tab-aware) */
  function ResultsPanel() {
    if (isSearching) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "2rem 0", color: "var(--muted)" }}>
          <LoaderIcon size={24} className="animate-spin" />
          <span className="font-accent">SEARCHING...</span>
        </div>
      );
    }
    if (activeTab === "businesses") {
      return businesses.length === 0
        ? <p className="error-banner">No businesses found. Try a different keyword or city.</p>
        : <div className="grid-container">{businesses.map((b) => <BusinessCard key={b.id} biz={b} />)}</div>;
    }
    return events.length === 0
      ? (
        <p className="error-banner">
          No events found near {lastSearch.loc || lastSearch.q || "this area"}.{" "}
          <Link href="/dashboard/events/new" style={{ color: "var(--retro-teal)", fontWeight: 700 }}>
            Post one →
          </Link>
        </p>
      )
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
            <Link href="/results" className="font-accent nav-link">
              <div className="nav-icon-wrapper"><CompassIcon size={20} style={{ color: "white" }} /></div>
              EXPLORE
            </Link>
            <Link href="/post-your-business" className="font-accent nav-link">
              <div className="nav-icon-wrapper"><PlusCircleIcon size={20} style={{ color: "white" }} /></div>
              ADD LISTING
            </Link>
            <Link href="/login" className="card-stack-effect font-accent nav-link login-btn">LOGIN</Link>
          </nav>
          <div className="sidebar-features">
            <p className="font-accent sidebar-cat-label">BROWSE BY CATEGORY</p>
            {[
              { label: "FOOD & DRINK", icon: "restaurant",     bg: "bg-retro-orange", q: "food"    },
              { label: "RETAIL",       icon: "shopping_bag",   bg: "bg-retro-teal",   q: "retail"  },
              { label: "COFFEE",       icon: "coffee",         bg: "bg-retro-yellow", q: "coffee"  },
              { label: "BEAUTY",       icon: "spa",            bg: "bg-retro-red",    q: "beauty"  },
              { label: "FITNESS",      icon: "fitness_center", bg: "bg-retro-orange", q: "fitness" },
            ].map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => { setActiveTab("businesses"); runSearch(cat.q, lastSearch.loc); }}
                className={"feature-item sidebar-cat-btn"}
              >
                <div className={"feature-icon " + cat.bg}>
                  <span
                    className="material-icons"
                    style={{ fontSize: "1.2rem", color: cat.bg === "bg-retro-yellow" ? "var(--retro-brown)" : "white" }}
                  >
                    {cat.icon}
                  </span>
                </div>
                <span className="font-accent feature-text">{cat.label}</span>
              </button>
            ))}
          </div>
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
              <div className="results-header" style={{ justifyContent: "flex-end" }}>
                <button type="button" onClick={clearSearch} className="font-accent clear-btn">
                  CLEAR
                </button>
              </div>
              <ResultsPanel />
            </section>
          )}

          {/* ── Default browse state ── */}
          {!hasSearched && (
            <div className="main-layout">
              <section className="featured-section" id="featured">
                <div className="section-header">
                  <h3 className="section-title">How to <span className="text-retro-teal">Search</span></h3>
                </div>
                <div className="steps-container" style={{ marginBottom: "2rem" }}>
                  {[
                    { n: 1, bg: "bg-retro-yellow", title: "PICK A VIBE",  desc: "Type a keyword like BBQ, coffee, or festival." },
                    { n: 2, bg: "bg-retro-teal",   title: "CHOOSE TYPE",  desc: "Toggle between Business Listings and Local Events." },
                    { n: 3, bg: "bg-retro-red",    title: "ADD A CITY",   desc: "Enter a Texas city or ZIP and hit GO!" },
                  ].map((s) => (
                    <div key={s.n} className="step-item">
                      <div className={"step-number " + s.bg}>{s.n}</div>
                      <div className="step-content">
                        <h4 className="font-accent step-title">{s.title}</h4>
                        <p className="step-desc">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="map-section">
                  <div className="map-header">
                    <h3 className="map-title">Explore the <span className="text-retro-orange">Map</span></h3>
                    <span className="font-accent map-subtitle">INTERACTIVE VIEW</span>
                  </div>
                  <div className="map-container card-stack-effect">
                    {mapsApiKey && (
                      <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
                        src={"https://www.google.com/maps/embed/v1/search?key=" + mapsApiKey + "&q=local+gems+Texas&center=31.9686,-99.9018&zoom=6"}
                        allowFullScreen title="Texas Localist Map" />
                    )}
                    <div className="map-overlay">
                      <div className="map-overlay-content">
                        <MapPinIcon size={48} className="map-pin-icon" style={{ color: "var(--retro-red)" }} />
                        <h4 className="map-overlay-title">{mapsApiKey ? "Interactive Map" : "Map Preview"}</h4>
                        <p className="map-overlay-desc">
                          {mapsApiKey ? "Pan around Texas and inspect the live search context."
                            : "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the live map."}
                        </p>
                        <div className="font-accent demo-badge">{mapsApiKey ? "LIVE MAP ENABLED" : "DEMO MODE"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
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
    </div>
  );
}
