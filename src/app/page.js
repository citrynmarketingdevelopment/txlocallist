import Image from 'next/image';
import styles from './home.module.css';
import logo from './assets/Tx-Localist-01.png';

export const metadata = {
  title: 'Texas Localist | Find What\'s Nearby. Fast.',
  description: 'The no-nonsense directory for the Lone Star State. No ads. No tracking. Just Texas.',
};

export default function Home() {
  return (
    <div>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <div className={styles.navBrandImg}>
            <Image
              alt="Texas Localist Logo"
              src={logo}
              width={96}
              height={96}
              priority
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
        <div className={styles.navLinks}>
          <a href="#" className={styles.navLink}>EXPLORE</a>
          <a href="#" className={styles.navLink}>ADD LISTING</a>
          <button className={styles.navLoginButton}>LOGIN</button>
        </div>
        <button className={styles.menuButton}>
          <span className="material-icons">menu</span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroBgGradient}></div>
        </div>

        <h1 className={styles.heroHeading}>
          Find What's <br />
          <span className={styles.heroPrimary}>Local .</span> <span className={styles.heroUnderline}>Fast.</span>
        </h1>

        <div className={styles.searchContainer}>
          <div className={styles.searchInput}>
            <span className={`material-icons ${styles.searchIcon}`}>search</span>
            <input placeholder="What are you looking for?" type="text" />
          </div>
          <div className={styles.searchInput}>
            <span className={`material-icons ${styles.searchIcon}`}>location_on</span>
            <input placeholder="City or Zip" type="text" />
          </div>
          <button className={styles.searchButton}>GO!</button>
        </div>

        <p className={styles.heroTagline}>
          The no-nonsense directory for the Lone Star State. <br className="hidden md:block" /> No ads. No tracking. Just Texas.
        </p>
      </section>

      {/* Features Strip */}
      <section className={styles.featuresStrip}>
        <div className={styles.featuresContainer}>
          <div className={styles.featureItem}>
            <div className={styles.featureIconCircle}>
              <span className={`material-icons ${styles.featureIcon}`}>block</span>
            </div>
            <span className={styles.featureLabel}>NO ADS</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIconCircle}>
              <span className={`material-icons ${styles.featureIcon}`}>volume_off</span>
            </div>
            <span className={styles.featureLabel}>NO NOISE</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIconCircle}>
              <span className={`material-icons ${styles.featureIcon}`}>star</span>
            </div>
            <span className={styles.featureLabel}>JUST LOCAL</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIconCircle}>
              <span className={`material-icons ${styles.featureIcon}`}>thumb_up</span>
            </div>
            <span className={styles.featureLabel}>VERIFIED</span>
          </div>
        </div>
      </section>

      {/* Featured Gems Section */}
      <section className={styles.gemsSection}>
        <div className={styles.gemsSectionHeader}>
          <div>
            <h2 className={styles.gemsTitle}>
              Featured <br />
              <span className={styles.gemsTitleAccent}>Gems</span>
            </h2>
          </div>
          <a href="#" className={styles.gemsLink}>SEE ALL BUSINESSES</a>
        </div>

        <div className={styles.gemsGrid}>
          {/* Card 1 */}
          <div className={styles.businessCard}>
            <div className={styles.businessImageContainer}>
              <img
                alt="Local Cafe"
                className={styles.businessImage}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8A2GdyTWdqLn6jx-_hSITUXdNr3wORseQXb01vX21diKx9xFiAGyi9t78SHN7LRGsejMKYzNg9k6utvRci63AmGAfZkbZq71UX0gJcpgbtIV7rVYv4B2GwS2PWhMCEFlmqv-T9CXDkidJJ9fRyckmDUBcb97vf6uDBAK7BFRiDF9PjGPgZDX2VUxJUD0hu5tx8HfWMN97D5710zHV4daKtfJGXLDcQebSDfPbK_o7jVUIZTFcilrWR43Et2YLnSkOtuBwZv9vkwI"
              />
            </div>
            <div className={styles.businessBadge}>AUSTIN</div>
            <h3 className={styles.businessTitle}>Starlight Cafe</h3>
            <p className={styles.businessDescription}>
              The best sourdough in the hill country. Family owned since 1974.
            </p>
            <div className={styles.businessFooter}>
              <span className={styles.businessCategory}>$$ • BAKERY</span>
              <button className={styles.businessArrowButton}>
                <span className={`material-icons ${styles.arrowIcon}`}>arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className={styles.businessCard}>
            <div className={styles.businessImageContainer}>
              <img
                alt="Vintage Shop"
                className={styles.businessImage}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbEIBI6L9dC0ie9eU66YFIzNdrZyg083eCuDV666N6H9tAr94iR5gwTUOWmYyifRCsSopwn6rub9ymjqcFTgZ6_tlmoUguiR7rxL831CVzjMBBk6ec8bSYW_G5a00AqWmHKZTJpX6IFAOwUugfmtG6SYCiEBUWxI8gNUajUDFwMdUnKBpmGcd6TkE48IQRPY9B-CF7QzubJlb5lQsBt8ygRIECGar-DfsoO7NTJa6igIxonbvFHt1zxQl4RKa_mkf_S3Ba-lxJZuY"
              />
            </div>
            <div className={styles.businessBadge}>MARFA</div>
            <h3 className={styles.businessTitle}>Neon Cowboy</h3>
            <p className={styles.businessDescription}>
              Curated vintage Western wear and desert oddities. Truly one of a kind.
            </p>
            <div className={styles.businessFooter}>
              <span className={styles.businessCategory}>$$$ • RETAIL</span>
              <button className={styles.businessArrowButton}>
                <span className={`material-icons ${styles.arrowIcon}`}>arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className={styles.businessCard}>
            <div className={styles.businessImageContainer}>
              <img
                alt="Barbecue Joint"
                className={styles.businessImage}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhb_JF5jLsjsWFF3OgR0xWgx6NxlHjg5et6OuMW3DsbsHQzGfH-p8ZwKK4MUf3t9AphDfz-dKM4ZvwBjd6F63BHyX0dkjpibA2eZhIm019AY8SnrRW1xCDmCsRRyXm4I6dtsS6JbEmsYcIHaizCKBz0Rpw6GkFXz2Ud_rUltWn6V0vCfapnJ00RJnlj2yJfVNNmKjZGaUXhvBnnGdM1ITZPu7Ajo8dIODcLA8BGOsMgASgDn58-BlebRW-ftzXmDsrsRdZpCGZgfk"
              />
            </div>
            <div className={styles.businessBadge}>LOCKHART</div>
            <h3 className={styles.businessTitle}>Old Oak BBQ</h3>
            <p className={styles.businessDescription}>
              Central Texas style brisket smoked for 16 hours. No sauce needed.
            </p>
            <div className={styles.businessFooter}>
              <span className={styles.businessCategory}>$ • FOOD</span>
              <button className={styles.businessArrowButton}>
                <span className={`material-icons ${styles.arrowIcon}`}>arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <div className={styles.howItWorksContainer}>
          <h2 className={styles.howItWorksTitle}>
            How it <span className={styles.howItWorksAccent}>Works.</span>
          </h2>

          <div className={styles.howItWorksGrid}>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>1</div>
              <h4 className={styles.stepLabel}>PICK A VIBE</h4>
              <p className={styles.stepDescription}>
                Choose what you're in the mood for from our curated categories.
              </p>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>2</div>
              <h4 className={styles.stepLabel}>FIND THE SPOT</h4>
              <p className={styles.stepDescription}>
                Browse verified local favorites without any pesky advertisements.
              </p>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>3</div>
              <h4 className={styles.stepLabel}>SUPPORT LOCAL</h4>
              <p className={styles.stepDescription}>
                Head on over and keep the Texas spirit alive and well.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg}>
          <img
            alt="Retro wave background"
            className={styles.ctaBgImage}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRyvcjY9K8xM4cLlT8qibxFqStnZHkHvPZehIiK60agkd3qaqgqhzVsncUqeV7XCZhseo8qtgJczyAv3PZUJ4ostdVn9_1II07tsiGIExEzrwnS4M52YpDQIdAPQJRE-SmctrFIeUHtEjq5A_7CKGBYtSKgk9NtI9doaiNeJSksFXZk0G9fpxAD00yCbhaHFKTo8e-2FaTQQU1SzhUaSGFUKNy-Scuy-vA49OSHWwI3uOk7wbJhs8xyt94Y31ZY7mnPOy8COiHodU"
          />
        </div>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>
            Skip the <span className={styles.ctaAccent}>Noise.</span>
          </h2>
          <p className={styles.ctaTagline}>No ads. No nonsense. Just local.</p>
          <button className={styles.ctaButton}>START EXPLORING</button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLogo}>
            <Image
              alt="Texas Localist"
              src={logo}
              width={80}
              height={80}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>ABOUT</a>
            <a href="#" className={styles.footerLink}>PRIVACY</a>
            <a href="#" className={styles.footerLink}>CONTACT</a>
          </div>
          <div className={styles.footerSocial}>
            <button className={styles.socialButton}>
              <span className={`material-icons ${styles.socialIcon}`}>share</span>
            </button>
            <button className={styles.socialButton}>
              <span className={`material-icons ${styles.socialIcon}`}>camera_alt</span>
            </button>
          </div>
        </div>
        <div className={styles.footerCopyright}>
          © 2024 TEXAS LOCALIST. ALL RIGHTS RESERVED. HANDCRAFTED IN THE LONE STAR STATE.
        </div>
      </footer>
    </div>
  );
}
