import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Navbar, Footer, Button } from "@/components";
import { getFeatures } from "@/lib/tiers";

import styles from "./page.module.css";

/**
 * Dynamic metadata for SEO.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      city: { select: { name: true } },
    },
  });

  if (!business) {
    return { title: "Business not found" };
  }

  return {
    title: `${business.name} in ${business.city.name} | Texas Localist`,
    description: business.description,
    openGraph: {
      title: business.name,
      description: business.description,
      type: "website",
    },
  };
}

/**
 * Generate static paths for the top 100 businesses.
 * Other paths are generated on-demand (ISR).
 */
export async function generateStaticParams() {
  try {
    const businesses = await prisma.business.findMany({
      where: { status: "ACTIVE", publishedAt: { not: null } },
      select: { slug: true },
      take: 100,
      orderBy: { publishedAt: "desc" },
    });

    return businesses.map((b) => ({ slug: b.slug }));
  } catch (error) {
    console.warn("Skipping business static params generation:", error.message);
    return [];
  }
}

export const revalidate = 3600; // Revalidate every hour

/**
 * Detail page for a business listing.
 */
export default async function BusinessDetailPage({ params }) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      owner: {
        select: { id: true, name: true },
      },
      city: {
        select: { id: true, name: true, slug: true },
      },
      plan: {
        select: { slug: true, features: true },
      },
      photos: {
        orderBy: { order: "asc" },
      },
      categories: {
        select: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
      tags: {
        select: {
          tag: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
      socialLinks: {
        orderBy: { order: "asc" },
      },
      jobs: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  // Not found
  if (!business || business.status !== "ACTIVE") {
    notFound();
  }

  // Parse features
  const features = getFeatures(business.plan?.slug);
  const showContact = features.SHOW_CONTACT;
  const showWebsite = features.SHOW_WEBSITE;
  const showSocials = features.SHOW_SOCIALS;

  // Main image
  const mainPhoto = business.photos[0];

  return (
    <>
      <Navbar />

      <main className={styles.container}>
        {/* Hero / Gallery Section */}
        <section className={styles.hero}>
          {mainPhoto ? (
            <div className={styles.heroImage}>
              <img
                src={mainPhoto.url}
                alt={mainPhoto.alt || business.name}
                width={1000}
                height={600}
              />
            </div>
          ) : (
            <div className={styles.heroPlaceholder}>
              <div className={styles.placeholderText}>No image available</div>
            </div>
          )}

          {/* Additional photos carousel (minimal) */}
          {business.photos.length > 1 && (
            <div className={styles.photoGallery}>
              {business.photos.slice(1, 4).map((photo) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.alt || ""}
                  className={styles.thumbPhoto}
                />
              ))}
            </div>
          )}
        </section>

        {/* Content Section */}
        <section className={styles.content}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>{business.name}</h1>
              <p className={styles.location}>
                📍 {business.addressName}, {business.city.name}
              </p>
            </div>

            {/* Tier badge */}
            <div className={styles.tierBadge}>{business.plan?.slug || "Free"}</div>
          </div>

          {/* Description */}
          <p className={styles.description}>{business.description}</p>

          {/* Contact Info (tier-gated) */}
          {(showContact || showWebsite || showSocials) && (
            <div className={styles.contactSection}>
              <h2 className={styles.sectionTitle}>Get in Touch</h2>

              {showContact && (
                <div className={styles.contactBlock}>
                  {business.phone && (
                    <div>
                      <a href={`tel:${business.phone}`} className={styles.contactLink}>
                        📞 {business.phone}
                      </a>
                    </div>
                  )}
                  {business.email && (
                    <div>
                      <a href={`mailto:${business.email}`} className={styles.contactLink}>
                        ✉️ {business.email}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {showWebsite && business.website && (
                <div>
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.websiteButton}
                  >
                    Visit Website →
                  </a>
                </div>
              )}

              {showSocials && business.socialLinks.length > 0 && (
                <div className={styles.socials}>
                  {business.socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label={link.platform}
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}

              {!showContact && (
                <div className={styles.upgradePrompt}>
                  <p>
                    <strong>Upgrade to see contact info →</strong>
                  </p>
                  <Button as="link" href="/pricing" variant="primary">
                    View Plans
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Categories & Tags */}
          {business.categories.length > 0 && (
            <div className={styles.categories}>
              <h3 className={styles.sectionTitle}>Categories</h3>
              <div className={styles.chipList}>
                {business.categories.map((bc) => (
                  <Link
                    key={bc.category.id}
                    href={`/categories/${bc.category.slug}`}
                    className={styles.chip}
                  >
                    {bc.category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {business.tags.length > 0 && (
            <div className={styles.tags}>
              <h3 className={styles.sectionTitle}>Tags</h3>
              <div className={styles.chipList}>
                {business.tags.map((bt) => (
                  <Link
                    key={bt.tag.id}
                    href={`/search?q=${encodeURIComponent(bt.tag.name)}`}
                    className={styles.chipSecondary}
                  >
                    #{bt.tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Jobs Section (if available and owner has job posting tier) */}
          {features.JOB_POSTINGS > 0 && business.jobs.length > 0 && (
            <div className={styles.jobsSection}>
              <h2 className={styles.sectionTitle}>
                Open Positions ({business.jobs.length})
              </h2>
              <div className={styles.jobsList}>
                {business.jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className={styles.jobCard}
                  >
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <p className={styles.jobType}>{job.employmentType}</p>
                    {job.salaryMin && job.salaryMax && (
                      <p className={styles.jobSalary}>
                        ${(job.salaryMin / 100).toLocaleString()} —{" "}
                        ${(job.salaryMax / 100).toLocaleString()}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Breadcrumb / Navigation */}
        <section className={styles.navigation}>
          <Link href={`/cities/${business.city.slug}`} className={styles.backLink}>
            ← Back to {business.city.name}
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
