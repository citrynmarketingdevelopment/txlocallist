import Link from "next/link";

import styles from "./Button.module.css";

/**
 * Retro chunky button with the signature card-stack shadow.
 *
 * Props:
 *   - variant: "primary" (default, red) | "secondary" (teal) | "ghost" | "cream"
 *   - size:    "sm" | "md" (default) | "lg"
 *   - as:      "button" (default) | "link" | "a"
 *   - href:    required when as !== "button"
 *   - rotate:  optional degrees (e.g. -2) for a playful offset
 */
export default function Button({
  variant = "primary",
  size = "md",
  as = "button",
  href,
  rotate,
  className = "",
  children,
  style,
  ...rest
}) {
  const classes = [
    styles.btn,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const finalStyle = rotate ? { transform: `rotate(${rotate}deg)`, ...style } : style;

  if (as === "link") {
    return (
      <Link href={href} className={classes} style={finalStyle} {...rest}>
        {children}
      </Link>
    );
  }

  if (as === "a") {
    return (
      <a href={href} className={classes} style={finalStyle} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} style={finalStyle} {...rest}>
      {children}
    </button>
  );
}
