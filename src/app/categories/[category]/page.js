import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Navbar, Footer, BusinessCard } from "@/components";

import styles from "./page.module.css";

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { name: true },
  });

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: `${category.name} Businesses | Texas Localist`,
    description: `Find ${category.name.toLowerCase()} businesses across Texas.`,
  };
}

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    return categories.map((c) => ({ category: c.slug }));
  } catch (error) {
    console.warn("Skipping category static params generation:", error.message);
    return [];
  }
}

export const revalidate = 3600;

export default async function CategoryPage({ params, searchParams }) {
  const { category: categorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    notFound();
  }

  // Filter by city if provided
  const cityFilter = resolvedSearchParams?.city
    ? { slug: resolvedSearchParams.city }
    : undefined;

  const businesses = await prisma.business.findMany({
    where: {
      status: "ACTIVE",
      publishedAt: { not: null },
      categories: { some: { categoryId: category.id } },
      city: cityFilter,
    },
    include: {
      city: { select: { name: true, slug: true } },
      photos: { take: 1 },
      plan: { select: { slug: true, features: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  // Group by city
  const citiesMap = new Map();
  businesses.forEach((business) => {
    const citySlug = business.city.slug;
    if (!citiesMap.has(citySlug)) {
      citiesMap.set(citySlug, {
        name: business.city.name,
        businesses: [],
      });
    }
    citiesMap.get(citySlug).businesses.push(business);
  });

  return (
    <>
      <Navbar />

      <main className={styles.container}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            {category.icon && <span className={styles.icon}>{category.icon}</span>}
            {category.name}
          </h1>
          <p className={styles.heroTagline}>
            {businesses.length} {category.name.toLowerCase()} business
            {businesses.length !== 1 ? "es" : ""} across Texas
          </p>
        </section>

        {/* Results by City */}
        {businesses.length > 0 ? (
          <div className={styles.citySections}>
            {Array.from(citiesMap.entries()).map(([citySlug, cityData]) => (
              <section key={citySlug} className={styles.citySection}>
                <h2 className={styles.cityTitle}>
                  <Link href={`/cities/${citySlug}`} className={styles.cityLink}>
                    {cityData.name}
                  </Link>
                </h2>

                <div className={styles.businessGrid}>
                  {cityData.businesses.map((business) => (
                    <BusinessCard
                      key={business.id}
                      business={{
                        slug: business.slug,
                        name: business.name,
                        city: business.city.name,
                        description: business.description,
                        price: "$",
                        category: category.name,
                        imageUrl: business.photos[0]?.url || "/placeholder.jpg",
                        imageAlt: business.name,
                      }}
                      badgeTone="teal"
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className={styles.emptyState}>
            <h2>No {category.name.toLowerCase()} businesses found</h2>
            <p>Start exploring or post your business!</p>
            <Link href="/post-your-business" className={styles.ctaButton}>
              Post Your Business
            </Link>
          </section>
        )}

        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/search">← Back to search</Link>
        </nav>
      </main>

      <Footer />
    </>
  );
}
