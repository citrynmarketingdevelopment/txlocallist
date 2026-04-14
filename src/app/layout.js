import { Bungee, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bungee = Bungee({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "TX Local List",
  description:
    "TX Local List with secure signup, login, and a protected admin dashboard.",
  icons: {
    icon: "/citryn-gold.png",
    shortcut: "/citryn-gold.png",
    apple: "/citryn-gold.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} ${bungee.variable}`}
    >
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
