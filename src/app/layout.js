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
  title: "Citryn Next Boilerplate",
  description:
    "Citryn starter repo for Next.js projects with Zustand installed and Prisma-ready environment placeholders.",
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
