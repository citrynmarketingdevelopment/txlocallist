import { Suspense } from "react";

import { Navbar, Footer } from "@/components";
import { SearchResultsContent } from "./SearchResultsContent";

import styles from "./page.module.css";

export const metadata = {
  title: "Search Businesses | Texas Localist",
  description: "Find local businesses, cafes, shops, and more across Texas.",
};

/**
 * Search page wrapper. The actual search logic is in SearchResultsContent
 * which is a client component for handling state and API calls.
 */
export default function SearchPage({ searchParams }) {
  const query = searchParams.q || "";
  const location = searchParams.loc || "";
  const category = searchParams.category || "";
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  return (
    <>
      <Navbar />

      <main className={styles.container}>
        <Suspense fallback={<SearchPageSkeleton />}>
          <SearchResultsContent
            initialQuery={query}
            initialLocation={location}
            initialCategory={category}
            initialPage={page}
          />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

function SearchPageSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonBar}></div>
      <div className={styles.skeletonGrid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.skeletonCard}></div>
        ))}
      </div>
    </div>
  );
}
