export { default } from "./ResultsExperience";
/*

import Image from 'next/image';
import logoImage from '@/assets/Tx-Localist-01.png';
import {
  Search,
  MapPin,
  Compass,
  PlusCircle,
  Ban,
  VolumeX,
  Star,
  ThumbsUp,
  ArrowRight,
  Share2,
  Camera,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import useStore from '@/store/useStore';

export default function Home() {
  const {
    searchQuery,
    locationQuery,
    isSearching,
    results,
    error,
    setSearchQuery,
    setLocationQuery,
    setIsSearching,
    setResults,
    setError,
  } = useStore();

  const handleSearch = async () => {
    if (!searchQuery && !locationQuery) {
      return;
    }

    setIsSearching(true);
    setError(null);
    setResults([]);

    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!geminiApiKey) {
      setError('Add NEXT_PUBLIC_GEMINI_API_KEY to run AI search.');
      setIsSearching(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const prompt = `Find local gems for "${searchQuery}" in ${locationQuery || 'Texas'}. Provide a list of 3-5 places with their names and addresses.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
        },
      });

      const text = response.text;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const parsedResults = [];

      if (chunks) {
        chunks.forEach((chunk) => {
          if (chunk.maps) {
            parsedResults.push({
              name: chunk.maps.title || 'Local Gem',
              address: 'Verified via Google Maps',
              url: chunk.maps.uri,
            });
          }
        });
      }

      if (parsedResults.length === 0) {
        const lines = text.split('\n').filter((line) => line.trim().length > 0);

        lines.slice(0, 5).forEach((line) => {
          if (line.includes(':') || line.match(/^\d\./)) {
            parsedResults.push({
              name: line.replace(/^\d\.\s+/, '').split(':')[0].trim(),
              address: 'Found via AI Search',
            });
          }
        });
      }

      setResults(parsedResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="logo-section">
            <Image
              src={logoImage}
              alt="Texas Localist"
              width={220}
              height={140}
              sizes="220px"
              className="logo-image"
              priority
            />
          </div>

          <nav className="sidebar-nav">
            <a href="#" className="font-accent nav-link">
              <div className="nav-icon-wrapper">
                <Compass size={20} color="white" />
              </div>
              EXPLORE
            </a>
            <a href="#" className="font-accent nav-link">
              <div className="nav-icon-wrapper">
                <PlusCircle size={20} color="white" />
              </div>
              ADD LISTING
            </a>
            <button className="card-stack-effect font-accent login-btn">LOGIN</button>
          </nav>

          <div className="sidebar-features">
            <div className="feature-item">
              <div className="feature-icon bg-retro-orange">
                <Ban size={20} color="white" />
              </div>
              <span className="font-accent feature-text">NO ADS</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon bg-retro-teal">
                <VolumeX size={20} color="white" />
              </div>
              <span className="font-accent feature-text">NO NOISE</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon bg-retro-yellow">
                <Star size={20} color="var(--retro-brown)" fill="var(--retro-brown)" />
              </div>
              <span className="font-accent feature-text">JUST LOCAL</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon bg-retro-red">
                <ThumbsUp size={20} color="white" />
              </div>
              <span className="font-accent feature-text">VERIFIED</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          &copy; 2024 TEXAS LOCALIST. <br />
          HANDCRAFTED IN THE LONE STAR STATE.
        </div>
      </aside>

      <main className="main-content">
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
                Find What&apos;s <span className="text-primary italic">Local.</span>{' '}
                <span className="underline header-underline">Fast.</span>
              </h2>
            </div>

            <div className="search-inputs">
              <div className="input-wrapper">
                <Search size={20} color="rgba(45, 36, 30, 0.5)" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="What are you looking for?"
                />
              </div>
              <div className="input-wrapper">
                <MapPin size={20} color="rgba(45, 36, 30, 0.5)" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder="City or Zip"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="search-button card-stack-effect"
              >
                {isSearching ? <Loader2 size={20} className="animate-spin" /> : 'GO!'}
              </button>
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          {error && (
            <p className="error-banner" role="status">
              {error}
            </p>
          )}

          <AnimatePresence>
            {results.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="results-section"
              >
                <div className="results-header">
                  <h3 className="results-title">
                    Search <span className="text-retro-red">Results</span>
                  </h3>
                  <button onClick={() => setResults([])} className="font-accent clear-btn">
                    CLEAR
                  </button>
                </div>
                <div className="grid-container">
                  {results.map((result, idx) => (
                    <motion.div
                      key={result.url ?? `${result.name}-${idx}`}
                      whileHover={{ scale: 1.02 }}
                      className="gem-card card-stack-effect"
                    >
                      <h4 className="gem-name">{result.name}</h4>
                      <p className="gem-address">{result.address}</p>
                      {result.url && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-accent gem-link"
                        >
                          VIEW ON MAPS <ArrowRight size={12} />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <div className="main-layout">
            <section className="featured-section">
              <div className="section-header">
                <h3 className="section-title">
                  Featured <span className="text-retro-teal">Gems</span>
                </h3>
                <a href="#" className="font-accent see-all-link">
                  SEE ALL BUSINESSES
                </a>
              </div>

              <div className="grid-container featured-grid">
                <motion.div whileHover={{ y: -4 }} className="gem-card card-stack-effect">
                  <div className="gem-image-wrapper">
                    <Image
                      src="https://picsum.photos/seed/cafe/400/300"
                      alt="Starlight Cafe"
                      width={400}
                      height={300}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="category-tag">AUSTIN</div>
                  <h4 className="gem-name">Starlight Cafe</h4>
                  <p className="gem-desc">
                    The best sourdough in the hill country. Family owned since 1974.
                  </p>
                  <div className="gem-footer">
                    <span className="font-accent gem-meta">$$ &middot; BAKERY</span>
                    <button className="gem-action-btn">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="gem-card card-stack-effect">
                  <div className="gem-image-wrapper">
                    <Image
                      src="https://picsum.photos/seed/shop/400/300"
                      alt="Neon Cowboy"
                      width={400}
                      height={300}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="category-tag bg-retro-red text-white">MARFA</div>
                  <h4 className="gem-name">Neon Cowboy</h4>
                  <p className="gem-desc">Curated vintage Western wear and desert oddities.</p>
                  <div className="gem-footer">
                    <span className="font-accent gem-meta">$$$ &middot; RETAIL</span>
                    <button className="gem-action-btn">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="gem-card card-stack-effect">
                  <div className="gem-image-wrapper">
                    <Image
                      src="https://picsum.photos/seed/bbq/400/300"
                      alt="Old Oak BBQ"
                      width={400}
                      height={300}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="category-tag bg-retro-teal text-white">LOCKHART</div>
                  <h4 className="gem-name">Old Oak BBQ</h4>
                  <p className="gem-desc">Central Texas style brisket smoked for 16 hours.</p>
                  <div className="gem-footer">
                    <span className="font-accent gem-meta">$ &middot; FOOD</span>
                    <button className="gem-action-btn">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="map-section">
                <div className="map-header">
                  <h3 className="map-title">
                    Explore the <span className="text-retro-orange">Map</span>
                  </h3>
                  <span className="font-accent map-subtitle">INTERACTIVE VIEW</span>
                </div>
                <div className="map-container card-stack-effect">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${encodeURIComponent(searchQuery || 'local gems')} in ${encodeURIComponent(locationQuery || 'Texas')}&center=31.9686,-99.9018&zoom=6`}
                    allowFullScreen
                    title="Texas Localist Map"
                  ></iframe>
                  <div className="map-overlay">
                    <div className="map-overlay-content">
                      <MapPin size={48} color="var(--retro-red)" className="map-pin-icon" />
                      <h4 className="map-overlay-title">Interactive Map</h4>
                      <p className="map-overlay-desc">
                        To enable the full interactive experience, please provide a Google Maps
                        API Key in your environment settings.
                      </p>
                      <div className="font-accent demo-badge">DEMO MODE ACTIVE</div>
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
                    <p className="step-desc">
                      Choose what you&apos;re in the mood for from our curated categories.
                    </p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number bg-retro-teal">2</div>
                  <div className="step-content">
                    <h4 className="font-accent step-title">FIND THE SPOT</h4>
                    <p className="step-desc">
                      Browse verified local favorites without any advertisements.
                    </p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number bg-retro-red">3</div>
                  <div className="step-content">
                    <h4 className="font-accent step-title">SUPPORT LOCAL</h4>
                    <p className="step-desc">
                      Head on over and keep the Texas spirit alive and well.
                    </p>
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
              <button className="card-stack-effect font-accent banner-btn">
                START EXPLORING
              </button>
            </div>
          </section>
        </div>

        <footer className="app-footer">
          <div className="font-accent footer-links">
            <a href="#">ABOUT</a>
            <a href="#">PRIVACY</a>
            <a href="#">CONTACT</a>
          </div>
          <div className="footer-social">
            <a href="#" className="social-link">
              <Share2 size={16} />
            </a>
            <a href="#" className="social-link">
              <Camera size={16} />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
*/
