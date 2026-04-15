"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import logoImage from "@/app/assets/Tx-Localist-01.png";

import { buildMapsLink, featuredGems, matchesSearch } from "./data";
import {
  ArrowRightIcon,
  BanIcon,
  CameraIcon,
  CompassIcon,
  LoaderIcon,
  MapPinIcon,
  PlusCircleIcon,
  SearchIcon,
  ShareIcon,
  StarIcon,
  ThumbsUpIcon,
  VolumeXIcon,
} from "./icons";

function FeaturedCard({ gem, colorClass = "" }) {
  return (
    <article className="gem-card card-stack-effect">
      <div className="gem-image-wrapper">
        <Image
          src={gem.imageUrl}
          alt={gem.name}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className={`category-tag ${colorClass}`.trim()}>{gem.city}</div>
      <h4 className="gem-name">{gem.name}</h4>
      <p className="gem-desc">{gem.description}</p>
      <div className="gem-footer">
        <span className="font-accent gem-meta">
          {gem.price} &middot; {gem.category.toUpperCase()}
        </span>
        <a
          href={buildMapsLink(gem)}
          target="_blank"
          rel="noopener noreferrer"
          className="gem-action-btn"
          aria-label={`Open ${gem.name} in Google Maps`}
        >
          <ArrowRightIcon size={16} />
        </a>
      </div>
    </article>
  );
}

export default function ResultsExperience() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const currentYear = new Date().getFullYear();
  const featuredCards = featuredGems.slice(0, 3);
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapQuery = `${searchQuery || "local gems"} in ${locationQuery || "Texas"}`;

  async function handleSearch() {
    if (!searchQuery.trim() && !locationQuery.trim()) {
      setError(
        "Try a category like bakery, books, or BBQ and add a Texas city when you want to narrow it down.",
      );
      setResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 250));

    const nextResults = featuredGems.filter((gem) =>
      matchesSearch(gem, searchQuery, locationQuery),
    );

    setResults(nextResults);
    setIsSearching(false);

    if (nextResults.length === 0) {
      setError(
        "No exact matches turned up in the demo set yet. Try Austin, Marfa, Lockhart, books, music, or outdoors.",
      );
    }
  }

  function clearSearch() {
    setSearchQuery("");
    setLocationQuery("");
    setResults([]);
    setError(null);
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-content">
          <Image
            src={logoImage}
            alt="Texas Localist"
            width={220}
            height={140}
            sizes="220px"
            className="logo-image"
            priority
          />

          <nav className="sidebar-nav">
            <Link href="/results" className="font-accent nav-link">
              <div className="nav-icon-wrapper">
                <CompassIcon size={20} style={{ color: "white" }} />
              </div>
              EXPLORE
            </Link>
            <Link href="/dashboard/events/new" className="font-accent nav-link">
              <div className="nav-icon-wrapper">
                <PlusCircleIcon size={20} style={{ color: "white" }} />
              </div>
              ADD LISTING
            </Link>
            <Link href="/login" className="card-stack-effect font-accent nav-link login-btn">
              LOGIN
            </Link>
          </nav>

          <div className="sidebar-features">
            <div className="feature-item">
              <div className="feature-icon bg-retro-orange">
                <BanIcon size={20} style={{ color: "white" }} />
              </div>
              <span className="font-accent feature-text">NO ADS</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon bg-retro-teal">
                <VolumeXIcon size={20} style={{ color: "white" }} />
              </div>
              <span className="font-accent feature-text">NO NOISE</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon bg-retro-yellow">
                <StarIcon size={20} filled style={{ color: "var(--retro-brown)" }} />
              </div>
              <span className="font-accent feature-text">JUST LOCAL</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon bg-retro-red">
                <ThumbsUpIcon size={20} style={{ color: "white" }} />
              </div>
              <span className="font-accent feature-text">VERIFIED</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          &copy; {currentYear} TEXAS LOCALIST. <br />
          HANDCRAFTED IN THE LONE STAR STATE.
        </div>
      </aside>

      <main className="main-content grainy-overlay">
        <header className="search-header">
          <div className="search-bar-container">
            <div className="mobile-logo-wrap">
              <Image
                src={logoImage}
                alt="Texas Localist"
                width={260}
                height={160}
                sizes="(max-width: 768px) 220px, 260px"
                className="mobile-logo-image"
                priority
              />
            </div>

            <div className="header-title-wrapper">
              <h2 className="header-title">
                Find What&apos;s <span className="text-primary italic">Local.</span>{" "}
                <span className="underline header-underline">Fast.</span>
              </h2>
            </div>

            <div className="search-inputs">
              <div className="input-wrapper">
                <SearchIcon size={20} style={{ color: "rgba(45, 36, 30, 0.5)" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="What are you looking for?"
                />
              </div>
              <div className="input-wrapper">
                <MapPinIcon size={20} style={{ color: "rgba(45, 36, 30, 0.5)" }} />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder="City or Zip"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="search-button card-stack-effect"
              >
                {isSearching ? <LoaderIcon size={20} className="animate-spin" /> : "GO!"}
              </button>
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          {error ? (
            <p className="error-banner" role="status">
              {error}
            </p>
          ) : null}

          {results.length > 0 ? (
            <section className="results-section">
              <div className="results-header">
                <h3 className="results-title">
                  Search <span className="text-retro-red">Results</span>
                </h3>
                <button type="button" onClick={clearSearch} className="font-accent clear-btn">
                  CLEAR
                </button>
              </div>
              <div className="grid-container">
                {results.map((result) => (
                  <article key={`${result.name}-${result.city}`} className="gem-card card-stack-effect">
                    <h4 className="gem-name">{result.name}</h4>
                    <p className="gem-address">{result.address}</p>
                    <p className="gem-desc">
                      {result.city}, {result.state} &middot; {result.category}
                    </p>
                    <a
                      href={buildMapsLink(result)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-accent gem-link"
                    >
                      VIEW ON MAPS <ArrowRightIcon size={12} />
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <div className="main-layout">
            <section className="featured-section" id="featured">
              <div className="section-header">
                <h3 className="section-title">
                  Featured <span className="text-retro-teal">Gems</span>
                </h3>
                <Link href="/events" className="font-accent see-all-link">
                  SEE ALL BUSINESSES
                </Link>
              </div>

              <div className="grid-container featured-grid">
                <FeaturedCard gem={featuredCards[0]} />
                <FeaturedCard gem={featuredCards[1]} colorClass="bg-retro-red text-white" />
                <FeaturedCard gem={featuredCards[2]} colorClass="bg-retro-teal text-white" />
              </div>

              <div className="map-section">
                <div className="map-header">
                  <h3 className="map-title">
                    Explore the <span className="text-retro-orange">Map</span>
                  </h3>
                  <span className="font-accent map-subtitle">INTERACTIVE VIEW</span>
                </div>
                <div className="map-container card-stack-effect">
                  {mapsApiKey ? (
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/search?key=${mapsApiKey}&q=${encodeURIComponent(mapQuery)}&center=31.9686,-99.9018&zoom=6`}
                      allowFullScreen
                      title="Texas Localist Map"
                    ></iframe>
                  ) : null}
                  <div className="map-overlay">
                    <div className="map-overlay-content">
                      <MapPinIcon size={48} className="map-pin-icon" style={{ color: "var(--retro-red)" }} />
                      <h4 className="map-overlay-title">{mapsApiKey ? "Interactive Map" : "Map Preview"}</h4>
                      <p className="map-overlay-desc">
                        {mapsApiKey
                          ? "Pan around Texas and inspect the live search context."
                          : "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY when you want the live embedded map. The retro layout is wired up already."}
                      </p>
                      <div className="font-accent demo-badge">
                        {mapsApiKey ? "LIVE MAP ENABLED" : "DEMO MODE ACTIVE"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="how-it-works">
              <h3 className="how-title">
                How it <span className="text-retro-red italic">Works.</span>
              </h3>
              <div className="steps-container">
                <div className="step-item">
                  <div className="step-number bg-retro-yellow">1</div>
                  <div className="step-content">
                    <h4 className="font-accent step-title">PICK A VIBE</h4>
                    <p className="step-desc">Choose a mood, a category, and a Texas city to start.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number bg-retro-teal">2</div>
                  <div className="step-content">
                    <h4 className="font-accent step-title">FIND THE SPOT</h4>
                    <p className="step-desc">Search the demo catalog instantly, then jump to Maps when ready.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number bg-retro-red">3</div>
                  <div className="step-content">
                    <h4 className="font-accent step-title">SUPPORT LOCAL</h4>
                    <p className="step-desc">Spend with places that feel distinct and worth recommending.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="promo-banner">
            <div className="banner-bg">
              <div className="banner-gradient"></div>
            </div>
            <div className="banner-content">
              <h3 className="text-shadow-retro banner-title">
                Skip the <span className="text-retro-yellow">Noise.</span>
              </h3>
              <p className="font-accent banner-subtitle">No ads. No nonsense. Just local.</p>
              <Link href="#featured" className="card-stack-effect font-accent banner-btn">
                START EXPLORING
              </Link>
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
            <a
              href="https://www.google.com/maps/search/?api=1&query=Texas+local+gems"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Share Texas Localist places"
            >
              <ShareIcon size={16} />
            </a>
            <Link href="/results" className="social-link" aria-label="Open the gallery view">
              <CameraIcon size={16} />
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
