import Image from "next/image";
import Link from "next/link";

import logo from "@/app/assets/Tx-Localist-01.png";
import styles from "./Navbar.module.css";

/**
 * Top navigation used on public marketing pages.
 *
 * Props:
 *   - links:        array of { href, label } for the primary links
 *   - loginHref:    href for the login pill
 *   - loginLabel:   text for the login pill (default "LOGIN")
 *   - onMenuOpen:   optional handler for the mobile menu button
 */
export default function Navbar({
  links = [
    { href: "/search", label: "EXPLORE" },
    { href: "/post-your-business", label: "ADD LISTING" },
  ],
  loginHref = "/login",
  loginLabel = "LOGIN",
  onMenuOpen,
}) {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className={styles.navBrand}>
        <Link href="/" aria-label="Texas Localist — Home" className={styles.navBrandImg}>
          <Image
            alt="Texas Localist Logo"
            src={logo}
            width={96}
            height={96}
            priority
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Link>
      </div>

      <div className={styles.navLinks}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={styles.navLink}>
            {link.label}
          </Link>
        ))}
        <Link
          href={loginHref}
          className={styles.navLoginButton}
          aria-label={`${loginLabel} to your account`}
        >
          {loginLabel}
        </Link>
      </div>

      <button
        type="button"
        className={styles.menuButton}
        aria-label="Open navigation menu"
        onClick={onMenuOpen}
      >
        <span className="material-icons" aria-hidden="true">
          menu
        </span>
      </button>
    </nav>
  );
}
